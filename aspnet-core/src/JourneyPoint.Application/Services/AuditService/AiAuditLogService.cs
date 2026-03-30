using System;
using System.Threading.Tasks;
using Abp.Dependency;
using Abp.Domain.Repositories;
using JourneyPoint.Domains.Audit;

namespace JourneyPoint.Application.Services.AuditService
{
    /// <summary>
    /// Persists append-only AI workflow audit records for extraction and personalisation flows.
    /// </summary>
    public class AiAuditLogService : IAiAuditLogService, ITransientDependency
    {
        private readonly IRepository<GenerationLog, Guid> _generationLogRepository;

        /// <summary>
        /// Initializes a new instance of the <see cref="AiAuditLogService"/> class.
        /// </summary>
        public AiAuditLogService(IRepository<GenerationLog, Guid> generationLogRepository)
        {
            _generationLogRepository = generationLogRepository ?? throw new ArgumentNullException(nameof(generationLogRepository));
        }

        /// <summary>
        /// Persists one completed AI workflow audit record.
        /// </summary>
        public async Task WriteAsync(AiAuditLogRequest request)
        {
            ArgumentNullException.ThrowIfNull(request);

            var startedAt = NormalizeTimestamp(request.StartedAt);
            var completedAt = NormalizeTimestamp(request.CompletedAt);
            if (completedAt < startedAt)
            {
                completedAt = startedAt;
            }

            var log = new GenerationLog
            {
                Id = Guid.NewGuid(),
                TenantId = request.TenantId,
                WorkflowType = request.WorkflowType,
                Status = request.Status,
                HireId = request.HireId,
                JourneyId = request.JourneyId,
                OnboardingPlanId = request.OnboardingPlanId,
                OnboardingDocumentId = request.OnboardingDocumentId,
                ModelName = TruncateRequired(request.ModelName, GenerationLog.MaxModelNameLength, nameof(request.ModelName)),
                PromptSummary = TruncateRequired(request.PromptSummary, GenerationLog.MaxPromptSummaryLength, nameof(request.PromptSummary)),
                ResponseSummary = TruncateOptional(request.ResponseSummary, GenerationLog.MaxResponseSummaryLength),
                FailureReason = TruncateOptional(request.FailureReason, GenerationLog.MaxFailureReasonLength),
                TasksAdded = Math.Max(request.TasksAdded, 0),
                TasksRevised = Math.Max(request.TasksRevised, 0),
                StartedAt = startedAt,
                CompletedAt = completedAt,
                DurationMilliseconds = Convert.ToInt64((completedAt - startedAt).TotalMilliseconds)
            };

            await _generationLogRepository.InsertAsync(log);
        }

        private static DateTime NormalizeTimestamp(DateTime value)
        {
            return value == default ? DateTime.UtcNow : value;
        }

        private static string TruncateRequired(string value, int maxLength, string parameterName)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                throw new ArgumentException("A non-empty value is required.", parameterName);
            }

            var normalizedValue = value.Trim();
            return normalizedValue.Length <= maxLength
                ? normalizedValue
                : normalizedValue[..maxLength];
        }

        private static string TruncateOptional(string value, int maxLength)
        {
            if (string.IsNullOrWhiteSpace(value))
            {
                return null;
            }

            var normalizedValue = value.Trim();
            return normalizedValue.Length <= maxLength
                ? normalizedValue
                : normalizedValue[..maxLength];
        }
    }
}
