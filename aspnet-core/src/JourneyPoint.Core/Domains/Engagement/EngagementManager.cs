using System;
using Abp.Domain.Services;
using JourneyPoint.Domains.Hires;

namespace JourneyPoint.Domains.Engagement
{
    /// <summary>
    /// Encapsulates engagement snapshot creation and at-risk flag lifecycle rules.
    /// </summary>
    public class EngagementManager : DomainService
    {
        /// <summary>
        /// Creates one append-only engagement snapshot for the specified hire and journey.
        /// </summary>
        public EngagementSnapshot CreateSnapshot(
            int tenantId,
            Hire hire,
            Journey journey,
            EngagementScoreInput input,
            EngagementScoreResult result)
        {
            EnsureTenantOwnership(tenantId, hire, journey);

            if (input == null)
            {
                throw new ArgumentNullException(nameof(input));
            }

            if (result == null)
            {
                throw new ArgumentNullException(nameof(result));
            }

            return new EngagementSnapshot
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                HireId = hire.Id,
                JourneyId = journey.Id,
                CompletionRate = result.CompletionRate,
                DaysSinceLastActivity = input.DaysSinceLastActivity,
                OverdueTaskCount = input.OverdueTaskCount,
                CompositeScore = result.CompositeScore,
                Classification = result.Classification,
                ComputedAt = NormalizeTimestamp(result.ComputedAt, nameof(result.ComputedAt))
            };
        }

        /// <summary>
        /// Creates a new unresolved at-risk flag for a hire that has fallen into the at-risk band.
        /// </summary>
        public AtRiskFlag RaiseAtRiskFlag(
            int tenantId,
            Hire hire,
            Journey journey,
            EngagementClassification classification,
            DateTime raisedAt)
        {
            EnsureTenantOwnership(tenantId, hire, journey);

            if (classification != EngagementClassification.AtRisk)
            {
                throw new InvalidOperationException("Only at-risk classifications can raise an at-risk flag.");
            }

            return new AtRiskFlag
            {
                Id = Guid.NewGuid(),
                TenantId = tenantId,
                HireId = hire.Id,
                JourneyId = journey.Id,
                RaisedAt = NormalizeTimestamp(raisedAt, nameof(raisedAt)),
                ClassificationAtRaise = classification,
                Status = AtRiskFlagStatus.Active
            };
        }

        /// <summary>
        /// Records facilitator acknowledgement without resolving the flag.
        /// </summary>
        public void AcknowledgeFlag(AtRiskFlag flag, long acknowledgedByUserId, string acknowledgementNotes)
        {
            EnsureFlag(flag);
            EnsureActionableFlag(flag);

            if (flag.Status != AtRiskFlagStatus.Active)
            {
                throw new InvalidOperationException("Only active at-risk flags can be acknowledged.");
            }

            flag.Status = AtRiskFlagStatus.Acknowledged;
            flag.AcknowledgedByUserId = EnsureUserId(acknowledgedByUserId, nameof(acknowledgedByUserId));
            flag.AcknowledgedAt = DateTime.UtcNow;
            flag.AcknowledgementNotes = NormalizeOptionalText(
                acknowledgementNotes,
                nameof(acknowledgementNotes),
                AtRiskFlag.MaxAcknowledgementNotesLength);
        }

        /// <summary>
        /// Resolves an unresolved flag through a facilitator action.
        /// </summary>
        public void ResolveFlag(
            AtRiskFlag flag,
            long resolvedByUserId,
            AtRiskResolutionType resolutionType,
            string resolutionNotes)
        {
            EnsureFlag(flag);
            EnsureActionableFlag(flag);

            flag.Status = AtRiskFlagStatus.Resolved;
            flag.ResolvedByUserId = EnsureUserId(resolvedByUserId, nameof(resolvedByUserId));
            flag.ResolvedAt = DateTime.UtcNow;
            flag.ResolutionType = resolutionType;
            flag.ResolutionNotes = NormalizeOptionalText(
                resolutionNotes,
                nameof(resolutionNotes),
                AtRiskFlag.MaxResolutionNotesLength);
        }

        /// <summary>
        /// Resolves an unresolved flag automatically after the hire returns to the healthy range.
        /// </summary>
        public void AutoResolveFlag(AtRiskFlag flag)
        {
            EnsureFlag(flag);
            EnsureActionableFlag(flag);

            flag.Status = AtRiskFlagStatus.Resolved;
            flag.ResolvedByUserId = null;
            flag.ResolvedAt = DateTime.UtcNow;
            flag.ResolutionType = AtRiskResolutionType.AutomaticHealthyRecovery;
            flag.ResolutionNotes = null;
        }

        private static void EnsureTenantOwnership(int tenantId, Hire hire, Journey journey)
        {
            if (tenantId <= 0)
            {
                throw new ArgumentOutOfRangeException(nameof(tenantId), "Tenant ownership is required.");
            }

            if (hire == null)
            {
                throw new ArgumentNullException(nameof(hire));
            }

            if (journey == null)
            {
                throw new ArgumentNullException(nameof(journey));
            }

            if (hire.TenantId != tenantId || journey.TenantId != tenantId || journey.HireId != hire.Id)
            {
                throw new InvalidOperationException("Engagement records must belong to one tenant-scoped hire journey.");
            }
        }

        private static void EnsureFlag(AtRiskFlag flag)
        {
            if (flag == null)
            {
                throw new ArgumentNullException(nameof(flag));
            }
        }

        private static void EnsureActionableFlag(AtRiskFlag flag)
        {
            if (flag.Status == AtRiskFlagStatus.Resolved)
            {
                throw new InvalidOperationException("Resolved at-risk flags cannot be changed again.");
            }
        }

        private static DateTime NormalizeTimestamp(DateTime value, string parameterName)
        {
            if (value == default)
            {
                throw new ArgumentOutOfRangeException(parameterName, "Timestamp is required.");
            }

            return value.Kind == DateTimeKind.Utc
                ? value
                : value.ToUniversalTime();
        }

        private static long EnsureUserId(long userId, string parameterName)
        {
            if (userId <= 0)
            {
                throw new ArgumentOutOfRangeException(parameterName, "User reference must be greater than zero.");
            }

            return userId;
        }

        private static string NormalizeOptionalText(string value, string parameterName, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var trimmedValue = value.Trim();

            if (trimmedValue.Length > maxLength)
            {
                throw new ArgumentException($"Value cannot exceed {maxLength} characters.", parameterName);
            }

            return trimmedValue;
        }
    }
}
