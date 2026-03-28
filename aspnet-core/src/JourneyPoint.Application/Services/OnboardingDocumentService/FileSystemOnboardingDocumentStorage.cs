using System;
using System.IO;
using System.Threading.Tasks;
using JourneyPoint.Configuration;
using Microsoft.Extensions.Options;

namespace JourneyPoint.Application.Services.OnboardingDocumentService
{
    /// <summary>
    /// Stores onboarding enrichment documents on the local filesystem.
    /// </summary>
    public class FileSystemOnboardingDocumentStorage : IOnboardingDocumentStorage
    {
        private readonly FileStorageOptions _fileStorageOptions;

        /// <summary>
        /// Initializes a new instance of the <see cref="FileSystemOnboardingDocumentStorage"/> class.
        /// </summary>
        public FileSystemOnboardingDocumentStorage(IOptions<FileStorageOptions> fileStorageOptions)
        {
            _fileStorageOptions = fileStorageOptions?.Value ?? throw new ArgumentNullException(nameof(fileStorageOptions));
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
                $"{documentId}{extension}");
            var absolutePath = ResolveAbsolutePath(relativePath);
            var directoryPath = Path.GetDirectoryName(absolutePath);

            if (!string.IsNullOrWhiteSpace(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            await File.WriteAllBytesAsync(absolutePath, content);
            return relativePath.Replace('\\', '/');
        }

        /// <summary>
        /// Reads one stored file by its relative storage path.
        /// </summary>
        public async Task<byte[]> ReadAsync(string storagePath)
        {
            var absolutePath = ResolveAbsolutePath(storagePath);
            return await File.ReadAllBytesAsync(absolutePath);
        }

        private string ResolveAbsolutePath(string relativeStoragePath)
        {
            var rootPath = Path.IsPathRooted(_fileStorageOptions.RootPath)
                ? _fileStorageOptions.RootPath
                : Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), _fileStorageOptions.RootPath));
            var storageRoot = Path.Combine(rootPath, _fileStorageOptions.PlanDocumentSubdirectory);
            var normalizedRelativePath = relativeStoragePath.Replace('/', Path.DirectorySeparatorChar);

            return Path.Combine(storageRoot, normalizedRelativePath);
        }
    }
}
