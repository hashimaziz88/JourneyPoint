using System.Threading.Tasks;
using Abp.Web.Security.AntiForgery;
using Microsoft.AspNetCore.Antiforgery;
using JourneyPoint.Controllers;
using Microsoft.AspNetCore.Mvc;

namespace JourneyPoint.Web.Host.Controllers
{
    /// <summary>
    /// Provides CSRF anti-forgery token generation and cookie-setting endpoints.
    /// </summary>
    public class AntiForgeryController : JourneyPointControllerBase
    {
        private readonly IAntiforgery _antiforgery;
        private readonly IAbpAntiForgeryManager _antiForgeryManager;

        /// <summary>
        /// Initializes a new instance of the <see cref="AntiForgeryController"/> class.
        /// </summary>
        public AntiForgeryController(IAntiforgery antiforgery, IAbpAntiForgeryManager antiForgeryManager)
        {
            _antiforgery = antiforgery;
            _antiForgeryManager = antiForgeryManager;
        }

        /// <summary>
        /// Sets the anti-forgery cookie and response header for the current request.
        /// </summary>
        public void GetToken()
        {
            _antiforgery.SetCookieTokenAndHeader(HttpContext);
        }

        /// <summary>
        /// Sets the ABP anti-forgery cookie for the current request.
        /// </summary>
        public void SetCookie()
        {
            _antiForgeryManager.SetCookie(HttpContext);
        }
    }
}
