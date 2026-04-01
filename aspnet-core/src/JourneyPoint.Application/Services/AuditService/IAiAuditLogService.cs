using System;
using System.Threading.Tasks;
using JourneyPoint.Application.Services.AuditService.Dto;

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
        Task<Guid> WriteAsync(AiAuditLogRequest request);
    }
}
