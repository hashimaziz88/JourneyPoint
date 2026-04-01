using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Abp.Dependency;
using Docnet.Core;
using Docnet.Core.Models;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.PixelFormats;
using UglyToad.PdfPig;
using JourneyPoint.Application.Services.DocumentExtractionService.Dto;

namespace JourneyPoint.Application.Services.DocumentExtractionService
{
    /// <summary>
    /// Extracts text or image payloads from uploaded onboarding source documents.
    /// </summary>
    public class DocumentContentExtractionService : IDocumentContentExtractionService, ITransientDependency
    {
        private const int MaximumRasterizedPages = 5;
        private const int RasterizedPageWidth = 1600;
        private const int RasterizedPageHeight = 2200;

        private static readonly string[] MarkdownExtensions =
        {
            ".md",
            ".markdown"
        };

        private static readonly string[] TextExtensions =
        {
            ".txt",
            ".text"
        };

        private static readonly string[] ImageExtensions =
        {
            ".png",
            ".jpg",
            ".jpeg",
            ".webp"
        };

        /// <summary>
        /// Extracts available text or image content from one document payload.
        /// </summary>
        public async Task<ExtractedDocumentContent> ExtractAsync(
            string fileName,
            string contentType,
            byte[] content)
        {
            if (string.IsNullOrWhiteSpace(fileName))
            {
                throw new ArgumentException("A source file name is required.", nameof(fileName));
            }

            if (content == null || content.Length == 0)
            {
                throw new ArgumentException("Source content cannot be empty.", nameof(content));
            }

            if (IsMarkdownOrTextDocument(fileName, contentType))
            {
                return new ExtractedDocumentContent
                {
                    TextContent = Encoding.UTF8.GetString(content)
                };
            }

            if (IsImageDocument(fileName, contentType))
            {
                return new ExtractedDocumentContent
                {
                    Images = new List<DocumentImageContent>
                    {
                        new DocumentImageContent
                        {
                            MimeType = ResolveImageContentType(fileName, contentType),
                            Base64Content = Convert.ToBase64String(content)
                        }
                    }
                };
            }

            if (IsPdfDocument(fileName, contentType))
            {
                return await ExtractPdfContentAsync(content);
            }

            throw new InvalidOperationException("Only markdown, plain-text, PDF, PNG, JPG, JPEG, and WEBP documents are supported.");
        }

        private static bool IsMarkdownOrTextDocument(string fileName, string contentType)
        {
            var extension = Path.GetExtension(fileName);
            var normalizedContentType = contentType ?? string.Empty;
            return MarkdownExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                   TextExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                   normalizedContentType.Contains("markdown", StringComparison.OrdinalIgnoreCase) ||
                   normalizedContentType.Equals("text/plain", StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsImageDocument(string fileName, string contentType)
        {
            var extension = Path.GetExtension(fileName);
            var normalizedContentType = contentType ?? string.Empty;
            return ImageExtensions.Contains(extension, StringComparer.OrdinalIgnoreCase) ||
                   normalizedContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase);
        }

        private static bool IsPdfDocument(string fileName, string contentType)
        {
            var normalizedContentType = contentType ?? string.Empty;
            return Path.GetExtension(fileName).Equals(".pdf", StringComparison.OrdinalIgnoreCase) ||
                   normalizedContentType.Equals("application/pdf", StringComparison.OrdinalIgnoreCase);
        }

        private static string ResolveImageContentType(string fileName, string contentType)
        {
            var normalizedContentType = contentType ?? string.Empty;
            if (normalizedContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
            {
                return normalizedContentType;
            }

            var extension = Path.GetExtension(fileName);
            if (extension.Equals(".png", StringComparison.OrdinalIgnoreCase))
            {
                return "image/png";
            }

            if (extension.Equals(".webp", StringComparison.OrdinalIgnoreCase))
            {
                return "image/webp";
            }

            return "image/jpeg";
        }

        private static async Task<ExtractedDocumentContent> ExtractPdfContentAsync(byte[] content)
        {
            var extractedText = TryExtractPdfText(content);
            if (HasMeaningfulText(extractedText))
            {
                return new ExtractedDocumentContent
                {
                    TextContent = extractedText
                };
            }

            var images = TryRenderPdfToImages(content);
            return await Task.FromResult(new ExtractedDocumentContent
            {
                Images = images
            });
        }

        private static string TryExtractPdfText(byte[] content)
        {
            try
            {
                using var stream = new MemoryStream(content, writable: false);
                using var document = PdfDocument.Open(stream);
                var pageTexts = Enumerable
                    .Range(1, document.NumberOfPages)
                    .Select(pageNumber => document.GetPage(pageNumber).Text?.Trim())
                    .Where(pageText => !string.IsNullOrWhiteSpace(pageText));

                return string.Join(Environment.NewLine + Environment.NewLine, pageTexts);
            }
            catch
            {
                return null;
            }
        }

        private static bool HasMeaningfulText(string extractedText)
        {
            return !string.IsNullOrWhiteSpace(extractedText) &&
                   extractedText.Any(character => !char.IsWhiteSpace(character) && !char.IsControl(character));
        }

        private static List<DocumentImageContent> TryRenderPdfToImages(byte[] content)
        {
            try
            {
                using var library = DocLib.Instance;
                using var documentReader = library.GetDocReader(
                    content,
                    new PageDimensions(RasterizedPageWidth, RasterizedPageHeight));
                var pageCount = Math.Min(documentReader.GetPageCount(), MaximumRasterizedPages);
                var images = new List<DocumentImageContent>();

                for (var pageIndex = 0; pageIndex < pageCount; pageIndex++)
                {
                    using var pageReader = documentReader.GetPageReader(pageIndex);
                    var pageImage = pageReader.GetImage();
                    if (pageImage == null || pageImage.Length == 0)
                    {
                        continue;
                    }

                    var pngBytes = ConvertBgraToPng(
                        pageImage,
                        pageReader.GetPageWidth(),
                        pageReader.GetPageHeight());

                    images.Add(new DocumentImageContent
                    {
                        MimeType = "image/png",
                        Base64Content = Convert.ToBase64String(pngBytes)
                    });
                }

                return images;
            }
            catch
            {
                return new List<DocumentImageContent>();
            }
        }

        private static byte[] ConvertBgraToPng(byte[] rawImageBytes, int width, int height)
        {
            using var image = Image.LoadPixelData<Bgra32>(rawImageBytes, width, height);
            using var memoryStream = new MemoryStream();
            image.Save(memoryStream, new PngEncoder());
            return memoryStream.ToArray();
        }
    }
}
