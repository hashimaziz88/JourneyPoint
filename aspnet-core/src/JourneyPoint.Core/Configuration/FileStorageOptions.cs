namespace JourneyPoint.Configuration
{
    /// <summary>
    /// Defines configurable settings for JourneyPoint file storage.
    /// </summary>
    public class FileStorageOptions
    {
        public string Provider { get; set; } = "FileSystem";

        public string RootPath { get; set; } = "App_Data/Storage";

        public string PublicBaseUrl { get; set; }

        public string PlanDocumentSubdirectory { get; set; } = "plan-documents";

        public bool EnsureDirectoriesOnStartup { get; set; } = true;
    }
}
