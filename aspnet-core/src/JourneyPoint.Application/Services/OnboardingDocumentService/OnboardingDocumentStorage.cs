using System;
using System.IO;
using System.Threading.Tasks;
using Abp.Dependency;
using JourneyPoint.Application.Services.FileStorageService;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    /// <summary>
    /// Stores onboarding enrichment documents through the shared file-storage abstraction.
    /// </summary>
    public class OnboardingDocumentStorage : IOnboardingDocumentStorage, ITransientDependency
    {
        private readonly IFileStorageService _fileStorageService;

        /// <summary>
        /// Initializes a new instance of the <see cref="OnboardingDocumentStorage"/> class.
        /// </summary>
        public OnboardingDocumentStorage(IFileStorageService fileStorageService)
        {
            _fileStorageService = fileStorageService ?? throw new ArgumentNullException(nameof(fileStorageService));
        }

        /// <summary>
        /// Saves one uploaded file and returns its relative storage path.
        /// </summary>
        public async Task<string> SaveAsync(int tenantId, Guid planId, Guid documentId, string fileName, byte[] content)
        {
            if (content == null || content.Length == 0)
            {
                throw new InvalidOperationException("Uploaded document content cannot be empty.");
            }

            var extension = Path.GetExtension(fileName);
            var relativePath = Path.Combine(
                $"tenant-{tenantId}",
                $"plan-{planId}",
                $"{documentId}{extension}")
                .Replace('\\', '/');

            await _fileStorageService.SaveAsync(
                FileStorageContainerNames.PlanDocuments,
                relativePath,
                content);

            return relativePath.Replace('\\', '/');
        }

        /// <summary>
        /// Reads one stored file by its relative storage path.
        /// </summary>
        public async Task<byte[]> ReadAsync(string storagePath)
        {
            return await _fileStorageService.ReadAsync(
                FileStorageContainerNames.PlanDocuments,
                storagePath);
        }
    }
}
