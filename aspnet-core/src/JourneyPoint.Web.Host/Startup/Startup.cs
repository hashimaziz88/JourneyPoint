using System;
using System.Linq;
using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Castle.Facilities.Logging;
using Abp.AspNetCore;
using Abp.AspNetCore.Mvc.Antiforgery;
using Abp.Castle.Logging.Log4Net;
using Abp.Extensions;
using JourneyPoint.Configuration;
using JourneyPoint.Identity;
using Abp.AspNetCore.SignalR.Hubs;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Models;
using System.IO;
using System.Collections.Generic;

namespace JourneyPoint.Web.Host.Startup
{
    public class Startup
    {
        private const string _defaultCorsPolicyName = "localhost";

        private const string _apiVersion = "v1";

        private readonly IConfigurationRoot _appConfiguration;
        private readonly IWebHostEnvironment _hostingEnvironment;

        public Startup(IWebHostEnvironment env)
        {
            _hostingEnvironment = env;
            _appConfiguration = env.GetAppConfiguration();
        }

        public void ConfigureServices(IServiceCollection services)
        {
            //MVC
            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(new AbpAutoValidateAntiforgeryTokenAttribute());
            });

            ConfigureJourneyPointOptions(services);

            IdentityRegistrar.Register(services);
            AuthConfigurer.Configure(services, _appConfiguration);

            services.AddSignalR();

            // Configure CORS for angular2 UI
            services.AddCors(
                options => options.AddPolicy(
                    _defaultCorsPolicyName,
                    builder => builder
                        .WithOrigins(
                            // App:CorsOrigins in appsettings.json can contain more than one address separated by comma.
                            _appConfiguration["App:CorsOrigins"]
                                .Split(",", StringSplitOptions.RemoveEmptyEntries)
                                .Select(o => o.RemovePostFix("/"))
                                .ToArray()
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                )
            );

            // Swagger - Enable this line and the related lines in Configure method to enable swagger UI
            ConfigureSwagger(services);

            // Configure Abp and Dependency Injection
            services.AddAbpWithoutCreatingServiceProvider<JourneyPointWebHostModule>(
                // Configure Log4Net logging
                options => options.IocManager.IocContainer.AddFacility<LoggingFacility>(
                    f => f.UseAbpLog4Net().WithConfig(_hostingEnvironment.IsDevelopment()
                        ? "log4net.config"
                        : "log4net.Production.config"
                    )
                )
            );
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            EnsureStorageDirectories();

            app.UseCors(_defaultCorsPolicyName); // Enable CORS!

            app.UseAbp(options => { options.UseAbpRequestLocalization = false; }); // Initializes ABP framework.

            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseAbpRequestLocalization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapHub<AbpCommonHub>("/signalr");
                endpoints.MapControllerRoute("default", "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapControllerRoute("defaultWithArea", "{area}/{controller=Home}/{action=Index}/{id?}");
            });

            // Enable middleware to serve generated Swagger as a JSON endpoint
            app.UseSwagger(c => { c.RouteTemplate = "swagger/{documentName}/swagger.json"; });

            // Enable middleware to serve swagger-ui assets (HTML, JS, CSS etc.)
            app.UseSwaggerUI(options =>
            {
                // specifying the Swagger JSON endpoint.
                options.SwaggerEndpoint($"/swagger/{_apiVersion}/swagger.json", $"JourneyPoint API {_apiVersion}");
                options.IndexStream = () => Assembly.GetExecutingAssembly()
                    .GetManifestResourceStream("JourneyPoint.Web.Host.wwwroot.swagger.ui.index.html");
                options.DisplayRequestDuration(); // Controls the display of the request duration (in milliseconds) for "Try it out" requests.
            }); // URL: /swagger
        }

        private void ConfigureSwagger(IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc(_apiVersion, new OpenApiInfo
                {
                    Version = _apiVersion,
                    Title = "JourneyPoint API",
                    Description = "JourneyPoint",
                    // uncomment if needed TermsOfService = new Uri("https://example.com/terms"),
                    Contact = new OpenApiContact
                    {
                        Name = "JourneyPoint",
                        Email = string.Empty,
                        Url = new Uri("https://journey-point.vercel.app/"),
                    },
                    License = new OpenApiLicense
                    {
                        Name = "MIT License",
                        Url = new Uri("https://github.com/aspnetboilerplate/aspnetboilerplate/blob/dev/LICENSE"),
                    }
                });
                options.DocInclusionPredicate((docName, description) => true);

                // Define the BearerAuth scheme that's in use
                options.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme()
                {
                    Description =
                        "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey
                });

                //add summaries to swagger
                bool canShowSummaries = _appConfiguration.GetValue<bool>("Swagger:ShowSummaries");
                if (canShowSummaries)
                {
                    var hostXmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                    var hostXmlPath = Path.Combine(AppContext.BaseDirectory, hostXmlFile);
                    options.IncludeXmlComments(hostXmlPath);

                    var applicationXml = $"JourneyPoint.Application.xml";
                    var applicationXmlPath = Path.Combine(AppContext.BaseDirectory, applicationXml);
                    options.IncludeXmlComments(applicationXmlPath);

                    var webCoreXmlFile = $"JourneyPoint.Web.Core.xml";
                    var webCoreXmlPath = Path.Combine(AppContext.BaseDirectory, webCoreXmlFile);
                    options.IncludeXmlComments(webCoreXmlPath);
                }
            });
        }

        private void ConfigureJourneyPointOptions(IServiceCollection services)
        {
            var groqOptions = BindOptions<GroqOptions>(AppSettingNames.Groq.SectionName);
            ValidateGroqOptions(groqOptions);
            services.Configure<GroqOptions>(_appConfiguration.GetSection(AppSettingNames.Groq.SectionName));

            var fileStorageOptions = BindOptions<FileStorageOptions>(AppSettingNames.Storage.SectionName);
            ValidateFileStorageOptions(fileStorageOptions);
            services.Configure<FileStorageOptions>(_appConfiguration.GetSection(AppSettingNames.Storage.SectionName));

            var mailOptions = BindOptions<MailOptions>(AppSettingNames.Mail.SectionName);
            ValidateMailOptions(mailOptions);
            services.Configure<MailOptions>(_appConfiguration.GetSection(AppSettingNames.Mail.SectionName));
        }

        private TOptions BindOptions<TOptions>(string sectionName)
            where TOptions : new()
        {
            var options = new TOptions();
            _appConfiguration.GetSection(sectionName).Bind(options);
            return options;
        }

        private void ValidateGroqOptions(GroqOptions options)
        {
            if (options == null)
            {
                throw new InvalidOperationException("Groq configuration is required.");
            }

            if (!options.Enabled)
            {
                return;
            }

            if (string.IsNullOrWhiteSpace(options.ApiKey))
            {
                throw new InvalidOperationException("Groq:ApiKey must be configured when Groq is enabled.");
            }

            if (string.IsNullOrWhiteSpace(options.BaseUrl) ||
                !Uri.TryCreate(options.BaseUrl, UriKind.Absolute, out Uri baseUri) ||
                !string.Equals(baseUri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException("Groq:BaseUrl must be a valid HTTPS URL when Groq is enabled.");
            }

            if (string.IsNullOrWhiteSpace(options.Model))
            {
                throw new InvalidOperationException("Groq:Model must be configured when Groq is enabled.");
            }

            if (options.TimeoutSeconds <= 0)
            {
                throw new InvalidOperationException("Groq:TimeoutSeconds must be greater than zero.");
            }
        }

        private void ValidateFileStorageOptions(FileStorageOptions options)
        {
            if (options == null)
            {
                throw new InvalidOperationException("Storage configuration is required.");
            }

            if (string.IsNullOrWhiteSpace(options.Provider))
            {
                throw new InvalidOperationException("Storage:Provider must be configured.");
            }

            if (string.IsNullOrWhiteSpace(options.RootPath))
            {
                throw new InvalidOperationException("Storage:RootPath must be configured.");
            }

            if (IsFileSystemProvider(options.Provider) && string.IsNullOrWhiteSpace(options.PlanDocumentSubdirectory))
            {
                throw new InvalidOperationException("Storage:PlanDocumentSubdirectory must be configured for the file-system provider.");
            }
        }

        private void ValidateMailOptions(MailOptions options)
        {
            if (options == null)
            {
                throw new InvalidOperationException("Mail configuration is required.");
            }

            if (!options.Enabled)
            {
                return;
            }

            if (string.IsNullOrWhiteSpace(options.FromAddress))
            {
                throw new InvalidOperationException("Mail:FromAddress must be configured when mail is enabled.");
            }

            if (string.IsNullOrWhiteSpace(options.Provider))
            {
                throw new InvalidOperationException("Mail:Provider must be configured when mail is enabled.");
            }

            if (IsPickupDirectoryProvider(options.Provider))
            {
                if (string.IsNullOrWhiteSpace(options.PickupDirectory))
                {
                    throw new InvalidOperationException("Mail:PickupDirectory must be configured for the pickup-directory provider.");
                }

                return;
            }

            if (string.IsNullOrWhiteSpace(options.SmtpHost))
            {
                throw new InvalidOperationException("Mail:SmtpHost must be configured for SMTP mail delivery.");
            }

            if (options.SmtpPort <= 0)
            {
                throw new InvalidOperationException("Mail:SmtpPort must be greater than zero for SMTP mail delivery.");
            }
        }

        private void EnsureStorageDirectories()
        {
            var options = BindOptions<FileStorageOptions>(AppSettingNames.Storage.SectionName);
            if (options == null ||
                !options.EnsureDirectoriesOnStartup ||
                !IsFileSystemProvider(options.Provider))
            {
                return;
            }

            var rootPath = ResolveHostPath(options.RootPath);
            Directory.CreateDirectory(rootPath);

            if (!string.IsNullOrWhiteSpace(options.PlanDocumentSubdirectory))
            {
                Directory.CreateDirectory(Path.Combine(rootPath, options.PlanDocumentSubdirectory));
            }

            if (!string.IsNullOrWhiteSpace(options.PublicBaseUrl) && !Uri.TryCreate(options.PublicBaseUrl, UriKind.Absolute, out Uri _))
            {
                throw new InvalidOperationException("Storage:PublicBaseUrl must be a valid absolute URL when provided.");
            }
        }

        private string ResolveHostPath(string configuredPath)
        {
            if (Path.IsPathRooted(configuredPath))
            {
                return configuredPath;
            }

            return Path.GetFullPath(Path.Combine(_hostingEnvironment.ContentRootPath, configuredPath));
        }

        private bool IsFileSystemProvider(string provider)
        {
            return string.Equals(provider, "FileSystem", StringComparison.OrdinalIgnoreCase);
        }

        private bool IsPickupDirectoryProvider(string provider)
        {
            return string.Equals(provider, "PickupDirectory", StringComparison.OrdinalIgnoreCase);
        }
    }
}
