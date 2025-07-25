using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace CloneTwiAPI.Services
{
    public class UserGetter
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserGetter(IHttpContextAccessor httpContextAccessor,
            UserManager<ApplicationUser> userManager)
        {
            _httpContextAccessor = httpContextAccessor;
            _userManager = userManager;
        }

        public async Task<ApplicationUser?> GetUser()
        {
            var userId = _httpContextAccessor.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userId))
                return null;

            var user = await _userManager.FindByIdAsync(userId);

            return user;
        }

        public bool IsCurrentUser(string userId)
        {
            return true ? userId == Convert.ToString(GetUser().Id) : false;
        }
    }
}
