using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CloneTwiAPI.Services
{
    public class UserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly GenerateJwtTokenService _generateToken;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
            GenerateJwtTokenService generateToken, IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _generateToken = generateToken;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<ActionResult> Register(RegisterDTO model)
        {
            var existingUser = await _userManager.FindByNameAsync(model.UserName);
            if (existingUser != null)
                return new BadRequestObjectResult("Username already exists");

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
                return new OkObjectResult("User registered successfully");

            var errors = result.Errors.Select(e => e.Description);
            return new BadRequestObjectResult(errors);
        }

        public async Task<ActionResult> Login(LoginDTO model)
        {
            var user = await _userManager.FindByNameAsync(model.UserNameEmail)
               ?? await _userManager.FindByEmailAsync(model.UserNameEmail);

            if (user == null)
                return new BadRequestObjectResult("User does not exist");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (!result.Succeeded)
                return new UnauthorizedObjectResult("Invalid password");

            var token = _generateToken.GenerateJwtToken(user);

            _httpContextAccessor.HttpContext!.Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(1)
            });

            return new OkObjectResult("User signed in successfully");
        }

        public async Task<ActionResult> ChangePassword(ChangePasswordDTO model)
        {
            var userId = _httpContextAccessor.HttpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return new UnauthorizedResult();

            var user = await _userManager.FindByIdAsync(userId);

            if (model.CurrentPassword == model.NewPassword)
                return new BadRequestObjectResult("New password cannot be the same as current one");

            var result = await _userManager.ChangePasswordAsync(user!, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
                return new BadRequestObjectResult(result.Errors);

            return new OkObjectResult("You have changed your password");
        }
    }
}
