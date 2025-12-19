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
                return new BadRequestObjectResult("Uživatel již existuje");

            var user = new ApplicationUser
            {
                UserName = model.UserName,
                Email = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
                return new OkObjectResult("Úspěšně jste se zaregistrovali");

            var errors = result.Errors.Select(e => e.Description);
            return new BadRequestObjectResult(errors);
        }

        public async Task<ActionResult> Login(LoginDTO model)
        {
            var user = await _userManager.FindByNameAsync(model.UserNameEmail)
               ?? await _userManager.FindByEmailAsync(model.UserNameEmail);

            if (user == null)
                return new BadRequestObjectResult("Uživatel neexistuje");

            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (!result.Succeeded)
                return new UnauthorizedObjectResult("Špatné heslo");

            var token = _generateToken.GenerateJwtToken(user);

            _httpContextAccessor.HttpContext!.Response.Cookies.Append("jwt", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = false,
                SameSite = SameSiteMode.Strict,
                Expires = DateTime.UtcNow.AddHours(100)
            });

            return new OkObjectResult("Úspěšně jste se přihlásili!");
        }

        public async Task<ActionResult> ChangePassword(ChangePasswordDTO model)
        {
            var user = await _userGetter.GetUser();

            if (model.CurrentPassword == model.NewPassword)
                return new BadRequestObjectResult("Nové heslo nemůže být stejné jako současné");

            var result = await _userManager.ChangePasswordAsync(user!, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
                return new BadRequestObjectResult(result.Errors);

            return new OkObjectResult("Úspěšně jste změnili své heslo!");
        }

        public async Task<ActionResult> AdditionalSettings(AdditionalUserSettingsDTO model)
        {
            var user = await _userGetter.GetUser();

            if (model.Bio != null)
                user!.Bio = model.Bio;

            if (model.ProfileImageUrl != null)
            {
                user!.ProfileImageUrl = await UploadService.Upload("userImages", model.ProfileImageUrl);
            }

            if (model.Background != null)
            {
                user!.Background = await UploadService.Upload("userImages", model.Background);
            }

            await _userManager.UpdateAsync(user!);

            return new OkObjectResult("Všechny údaje byly úspěšně aktualizovány");
        }

        public async Task<IActionResult?> GetInfo(string? userId)
        {
            ApplicationUser? user = null;

            if (!string.IsNullOrEmpty(userId))
                user = await _userManager.FindByIdAsync(userId);
            else
                user = await _userGetter.GetUser();

            return new OkObjectResult(new
            {
                user!.Id,
                user.UserName,
                user.Email,
                user.Bio,
                user.ProfileImageUrl,
                user.Title,
                user.Background
            });
        }

        public async Task<IActionResult> IsItMe(string userId)
        {
            string user = await _userGetter.GetUserId();

            return new OkObjectResult(user == userId ? true : false);
        }

        public async Task<IActionResult> GetAllUsers()
        {
            var currentUser = await _userGetter.GetUser();

            var users = _userGetter.GetAllUsers()
                .Where(u => u.Id != currentUser!.Id)
                .Select(u => new
                {
                    u.Id,
                    u.UserName,
                    u.ProfileImageUrl
                });

            return new OkObjectResult(users);
        }
    }
}
