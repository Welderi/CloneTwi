using CloneTwiAPI.Models;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloneTwiAPI.Controllers
{
    [ApiController]
    [AllowAnonymous]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly GenerateJwtTokenService _generateToken;
        private readonly UserManager<ApplicationUser> _userManager;

        public AuthController(GenerateJwtTokenService generateToken, UserManager<ApplicationUser> userManager)
        {
            _generateToken = generateToken;
            _userManager = userManager;
        }

        [HttpGet("google-login")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties { RedirectUri = "/api/auth/google-callback" };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            var authResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);
            if (!authResult.Succeeded)
                return BadRequest("");

            var email = authResult.Principal?.FindFirst(ClaimTypes.Email)?.Value;
            if (email == null)
                return BadRequest("");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return Unauthorized("");

            var token = _generateToken.GenerateJwtToken(user);

            HttpContext.Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddHours(100)
            });

            return Redirect("http://localhost:3000/main");
        }

    }
}
