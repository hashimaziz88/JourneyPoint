using System;
using System.Collections.Generic;

namespace JourneyPoint.Sessions.Dto
{
    /// <summary>
    /// Describes the application version metadata returned in the current session payload.
    /// </summary>
    public class ApplicationInfoDto
    {
        public string Version { get; set; }

        public DateTime ReleaseDate { get; set; }

        public Dictionary<string, bool> Features { get; set; }
    }
}
