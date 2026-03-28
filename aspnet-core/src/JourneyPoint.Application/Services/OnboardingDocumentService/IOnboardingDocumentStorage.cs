using System;
using System.Threading.Tasks;
using Abp.Dependency;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    /// <summary>
    /// Defines file storage operations for onboarding enrichment documents.
    /// </summary>
    public interface IOnboardingDocumentStorage : ITransientDependency
    {
        /// <summary>
        /// Saves one uploaded file and returns its relative storage path.
        /// </summary>
        Task<string> SaveAsync(int tenantId, Guid planId, Guid documentId, string fileName, byte[] content);

        /// <summary>
        /// Reads one stored file by its relative storage path.
        /// </summary>
        Task<byte[]> ReadAsync(string storagePath);
    }
}
