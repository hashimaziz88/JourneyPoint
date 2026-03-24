using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace JourneyPoint.Localization
{
    public static class JourneyPointLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(JourneyPointConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(JourneyPointLocalizationConfigurer).GetAssembly(),
                        "JourneyPoint.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
