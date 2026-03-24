using System.ComponentModel.DataAnnotations;

namespace JourneyPoint.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}