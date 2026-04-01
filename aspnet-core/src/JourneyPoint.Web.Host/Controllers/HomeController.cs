using Microsoft.AspNetCore.Mvc;
using JourneyPoint.Controllers;

namespace JourneyPoint.Web.Host.Controllers
{
    /// <summary>
    /// Redirects the application root to the Swagger UI.
    /// </summary>
    public class HomeController : JourneyPointControllerBase
    {
        /// <summary>
        /// Redirects the root request to the Swagger API documentation.
        /// </summary>
        public IActionResult Index()
        {
            return Redirect("/swagger");
        }
    }
}
