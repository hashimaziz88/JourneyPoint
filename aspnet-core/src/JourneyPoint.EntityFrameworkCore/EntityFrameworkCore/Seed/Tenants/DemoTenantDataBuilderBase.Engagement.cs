using System;
using System.Collections.Generic;
using System.Linq;
using JourneyPoint.Domains.Engagement;
using JourneyPoint.Domains.Hires;
using Microsoft.EntityFrameworkCore;

namespace JourneyPoint.EntityFrameworkCore.Seed.Tenants
{
    /// <summary>
    /// Provides engagement-history helpers for tenant-scoped demo data builders.
    /// </summary>
    public abstract partial class DemoTenantDataBuilderBase
    {
        protected void EnsureHistoricalSnapshots(Hire hire, Journey journey, IReadOnlyList<SnapshotSeed> snapshots)
        {
            var existingCount = Context.EngagementSnapshots
                .IgnoreQueryFilters()
                .Count(snapshot => snapshot.TenantId == Tenant.Id && snapshot.HireId == hire.Id);

            foreach (var snapshotSeed in snapshots.Skip(existingCount))
            {
                Context.EngagementSnapshots.Add(new EngagementSnapshot
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    HireId = hire.Id,
                    JourneyId = journey.Id,
                    CompletionRate = snapshotSeed.CompletionRate,
                    DaysSinceLastActivity = snapshotSeed.DaysSinceLastActivity,
                    OverdueTaskCount = snapshotSeed.OverdueTaskCount,
                    CompositeScore = snapshotSeed.CompositeScore,
                    Classification = snapshotSeed.Classification,
                    ComputedAt = snapshotSeed.ComputedAt
                });
            }

            Context.SaveChanges();
        }

        protected void EnsureResolvedFlag(
            Hire hire,
            Journey journey,
            DateTime raisedAt,
            DateTime acknowledgedAt,
            DateTime resolvedAt,
            long acknowledgedByUserId,
            long resolvedByUserId,
            string acknowledgementNotes,
            string resolutionNotes,
            AtRiskResolutionType resolutionType)
        {
            var flag = Context.AtRiskFlags
                .IgnoreQueryFilters()
                .SingleOrDefault(existingFlag =>
                    existingFlag.TenantId == Tenant.Id &&
                    existingFlag.HireId == hire.Id &&
                    existingFlag.Status == AtRiskFlagStatus.Resolved &&
                    existingFlag.ResolutionNotes == resolutionNotes);

            if (flag == null)
            {
                flag = new AtRiskFlag
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    HireId = hire.Id,
                    JourneyId = journey.Id
                };

                Context.AtRiskFlags.Add(flag);
            }

            flag.RaisedAt = raisedAt;
            flag.ClassificationAtRaise = EngagementClassification.AtRisk;
            flag.Status = AtRiskFlagStatus.Resolved;
            flag.AcknowledgedByUserId = acknowledgedByUserId;
            flag.AcknowledgedAt = acknowledgedAt;
            flag.AcknowledgementNotes = acknowledgementNotes;
            flag.ResolvedByUserId = resolvedByUserId;
            flag.ResolvedAt = resolvedAt;
            flag.ResolutionType = resolutionType;
            flag.ResolutionNotes = resolutionNotes;
            Context.SaveChanges();
        }

        protected void EnsureActiveFlag(Hire hire, Journey journey, DateTime raisedAt)
        {
            var flag = Context.AtRiskFlags
                .IgnoreQueryFilters()
                .SingleOrDefault(existingFlag =>
                    existingFlag.TenantId == Tenant.Id &&
                    existingFlag.HireId == hire.Id &&
                    existingFlag.Status != AtRiskFlagStatus.Resolved);

            if (flag == null)
            {
                flag = new AtRiskFlag
                {
                    Id = Guid.NewGuid(),
                    TenantId = Tenant.Id,
                    HireId = hire.Id,
                    JourneyId = journey.Id
                };

                Context.AtRiskFlags.Add(flag);
            }

            flag.RaisedAt = raisedAt;
            flag.ClassificationAtRaise = EngagementClassification.AtRisk;
            flag.Status = AtRiskFlagStatus.Active;
            flag.AcknowledgedByUserId = null;
            flag.AcknowledgedAt = null;
            flag.AcknowledgementNotes = null;
            flag.ResolvedByUserId = null;
            flag.ResolvedAt = null;
            flag.ResolutionType = null;
            flag.ResolutionNotes = null;
            Context.SaveChanges();
        }

        /// <summary>
        /// Represents one pre-seeded historical engagement snapshot.
        /// </summary>
        protected sealed record SnapshotSeed(
            decimal CompletionRate,
            int DaysSinceLastActivity,
            int OverdueTaskCount,
            decimal CompositeScore,
            EngagementClassification Classification,
            DateTime ComputedAt);
    }
}
