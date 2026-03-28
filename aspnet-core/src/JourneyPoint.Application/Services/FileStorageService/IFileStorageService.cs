using System.Threading.Tasks;
using Abp.Dependency;

namespace JourneyPoint.Application.Services.FileStorageService
{
    /// <summary>
    /// Defines container-based file storage operations for JourneyPoint application services.
    /// </summary>
    public interface IFileStorageService : ITransientDependency
    {
        /// <summary>
        /// Saves content inside one storage container at the provided relative path.
        /// </summary>
        Task SaveAsync(string containerName, string relativePath, byte[] content);

        /// <summary>
        /// Reads content from one storage container at the provided relative path.
        /// </summary>
        Task<byte[]> ReadAsync(string containerName, string relativePath);
    }
}
