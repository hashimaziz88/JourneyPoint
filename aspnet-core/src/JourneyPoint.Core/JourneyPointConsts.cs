using JourneyPoint.Debugging;

namespace JourneyPoint
{
    public class JourneyPointConsts
    {
        public const string LocalizationSourceName = "JourneyPoint";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "e31f30e5075148438e5b5a4eb03c61d4";
    }
}
