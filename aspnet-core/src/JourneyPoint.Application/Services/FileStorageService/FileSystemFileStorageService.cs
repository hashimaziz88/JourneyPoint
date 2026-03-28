using System;
using System.IO;
using System.Threading.Tasks;
using Abp.Dependency;
using JourneyPoint.Configuration;
using Microsoft.Extensions.Options;

namespace JourneyPoint.Application.Services.FileStorageService
{
    /// <summary>
    /// Stores JourneyPoint files on the local filesystem behind a container-based abstraction.
    /// </summary>
    public class FileSystemFileStorageService : IFileStorageService, ITransientDependency
    {
        private readonly FileStorageOptions _fileStorageOptions;

        /// <summary>
        /// Initializes a new instance of the <see cref="FileSystemFileStorageService"/> class.
        /// </summary>
        public FileSystemFileStorageService(IOptions<FileStorageOptions> fileStorageOptions)
        {
            _fileStorageOptions = fileStorageOptions?.Value ?? throw new ArgumentNullException(nameof(fileStorageOptions));
        }

        /// <summary>
        /// Saves content inside one storage container at the provided relative path.
        /// </summary>
        public async Task SaveAsync(string containerName, string relativePath, byte[] content)
        {
            if (content == null || content.Length == 0)
            {
                throw new InvalidOperationException("Stored file content cannot be empty.");
            }

            var absolutePath = ResolveAbsolutePath(containerName, relativePath);
            var directoryPath = Path.GetDirectoryName(absolutePath);

            if (!string.IsNullOrWhiteSpace(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }

            await File.WriteAllBytesAsync(absolutePath, content);
        }

        /// <summary>
        /// Reads content from one storage container at the provided relative path.
        /// </summary>
        public async Task<byte[]> ReadAsync(string containerName, string relativePath)
        {
            var absolutePath = ResolveAbsolutePath(containerName, relativePath);
            return await File.ReadAllBytesAsync(absolutePath);
        }

        private string ResolveAbsolutePath(string containerName, string relativePath)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(containerName, nameof(containerName));
            ArgumentException.ThrowIfNullOrWhiteSpace(relativePath, nameof(relativePath));

            var storageRoot = ResolveStorageRootPath();
            var containerPath = ResolveContainerPath(storageRoot, containerName);
            var normalizedRelativePath = relativePath.Replace('/', Path.DirectorySeparatorChar);
            var absolutePath = Path.GetFullPath(Path.Combine(containerPath, normalizedRelativePath));
            var boundedContainerPath = containerPath.EndsWith(Path.DirectorySeparatorChar)
                ? containerPath
                : containerPath + Path.DirectorySeparatorChar;

            if (!absolutePath.StartsWith(boundedContainerPath, StringComparison.OrdinalIgnoreCase) &&
                !string.Equals(absolutePath, containerPath, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Storage path must remain within the configured container.");
            }

            return absolutePath;
        }

        private string ResolveStorageRootPath()
        {
            return Path.IsPathRooted(_fileStorageOptions.RootPath)
                ? _fileStorageOptions.RootPath
                : Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), _fileStorageOptions.RootPath));
        }

        private string ResolveContainerPath(string storageRoot, string containerName)
        {
            var configuredSubdirectory = string.Equals(
                containerName,
                FileStorageContainerNames.PlanDocuments,
                StringComparison.OrdinalIgnoreCase)
                ? _fileStorageOptions.PlanDocumentSubdirectory
                : containerName;

            var normalizedSubdirectory = string.IsNullOrWhiteSpace(configuredSubdirectory)
                ? containerName
                : configuredSubdirectory.Trim();

            var containerPath = Path.GetFullPath(Path.Combine(storageRoot, normalizedSubdirectory));
            Directory.CreateDirectory(containerPath);
            return containerPath;
        }
    }
}
