using System.Collections.Generic;
using JourneyPoint.Application.Services.EngagementService.Dto;
using JourneyPoint.Domains.Engagement;

namespace JourneyPoint.Application.Services.EngagementService
{
    /// <summary>
    /// Provides DTO mapping helpers for engagement application workflows.
    /// </summary>
    public partial class EngagementAppService
    {
        private static EngagementSnapshotDto MapToSnapshotDto(EngagementSnapshot snapshot)
        {
            return new EngagementSnapshotDto
            {
                Id = snapshot.Id,
                CompletionRate = snapshot.CompletionRate,
                DaysSinceLastActivity = snapshot.DaysSinceLastActivity,
                OverdueTaskCount = snapshot.OverdueTaskCount,
                CompositeScore = snapshot.CompositeScore,
                Classification = snapshot.Classification,
                ComputedAt = snapshot.ComputedAt
            };
        }

        private static AtRiskFlagDto MapToFlagDto(
            AtRiskFlag flag,
            IReadOnlyDictionary<long, string> userDisplayNames)
        {
            return new AtRiskFlagDto
            {
                Id = flag.Id,
                HireId = flag.HireId,
                JourneyId = flag.JourneyId,
                Status = flag.Status,
                RaisedAt = flag.RaisedAt,
                ClassificationAtRaise = flag.ClassificationAtRaise,
                AcknowledgedByUserId = flag.AcknowledgedByUserId,
                AcknowledgedByDisplayName = GetUserDisplayName(userDisplayNames, flag.AcknowledgedByUserId),
                AcknowledgedAt = flag.AcknowledgedAt,
                AcknowledgementNotes = flag.AcknowledgementNotes,
                ResolvedByUserId = flag.ResolvedByUserId,
                ResolvedByDisplayName = GetUserDisplayName(userDisplayNames, flag.ResolvedByUserId),
                ResolvedAt = flag.ResolvedAt,
                ResolutionType = flag.ResolutionType,
                ResolutionNotes = flag.ResolutionNotes
            };
        }
    }
}
