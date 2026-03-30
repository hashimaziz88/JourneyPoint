using System.Threading.Tasks;

namespace JourneyPoint.Application.Services.AuditService
{
    /// <summary>
    /// Defines append-only persistence for AI workflow audit records.
    /// </summary>
    public interface IAiAuditLogService
    {
        /// <summary>
        /// Persists one completed AI workflow audit record.
        /// </summary>
        Task WriteAsync(AiAuditLogRequest request);
    }
}
