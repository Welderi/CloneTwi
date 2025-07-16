using CloneTwiAPI.DTOs;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Services
{
    public class UserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly GenerateJwtTokenService _generateToken;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserGetter _userGetter;

        public UserService(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager,
            GenerateJwtTokenService generateToken, IHttpContextAccessor httpContextAccessor,
            UserGetter userGetter)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _generateToken = generateToken;
            _httpContextAccessor = httpContextAccessor;
            _userGetter = userGetter;
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
            var user = await _userGetter.GetUser();

            if (model.CurrentPassword == model.NewPassword)
                return new BadRequestObjectResult("New password cannot be the same as current one");

            var result = await _userManager.ChangePasswordAsync(user!, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
                return new BadRequestObjectResult(result.Errors);

            return new OkObjectResult("You have changed your password");
        }

        public async Task<ActionResult> AdditionalSettings(AdditionalUserSettingsDTO model)
        {
            var user = await _userGetter.GetUser();

            if (model.Bio != null)
                user!.Bio = model.Bio;

            if (model.ProfileImageUrl != null)
            {
                var webRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                var uploadsFolder = Path.Combine(webRootPath, "images");
                Directory.CreateDirectory(uploadsFolder);

                var fileName = Guid.NewGuid() + Path.GetExtension(model.ProfileImageUrl.FileName);
                var filePath = Path.Combine(uploadsFolder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await model.ProfileImageUrl.CopyToAsync(stream);
                }

                user!.ProfileImageUrl = "/images/" + fileName;
            }

            await _userManager.UpdateAsync(user!);

            return new OkObjectResult("You have everything added");
        }

        public async Task<IActionResult?> GetInfo()
        {
            var user = await _userGetter.GetUser();

            return new OkObjectResult(new
            {
                user!.UserName,
                user.Email,
                user.Bio,
                user.ProfileImageUrl,
                user.Title
            });
        }
    }
}
