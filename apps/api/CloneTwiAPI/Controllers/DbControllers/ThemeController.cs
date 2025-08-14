using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThemeController : ControllerBase
    {
        private readonly ThemeService _service;
        public ThemeController(ThemeService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpGet("getallthemes")]
        public async Task<IActionResult> GetAllThemes() => await _service.GetAllThemes();
    }
}
