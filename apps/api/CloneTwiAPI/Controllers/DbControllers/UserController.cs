using CloneTwiAPI.DTOs;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserService _service;

        public UserController(UserService service)
        {
            _service = service;
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await _service.Register(model);
        }

        [HttpPost("login")]
        public async Task<ActionResult> Login([FromBody] LoginDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await _service.Login(model);
        }

        [Authorize]
        [HttpPost("changepassword")]
        public async Task<ActionResult> ChangePassword([FromBody] ChangePasswordDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await _service.ChangePassword(model);
        }

        [Authorize]
        [HttpPost("additionalsettings")]
        public async Task<ActionResult> AdditionalSettings([FromForm] AdditionalUserSettingsDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            return await _service.AdditionalSettings(model);
        }

        [Authorize]
        [HttpGet("getuserinfo")]
        public async Task<IActionResult?> GetInfo() => await _service.GetInfo();

        [Authorize]
        [HttpGet("getallusers")]
        public async Task<IActionResult> GetAllUsers() => await _service.GetAllUsers();
    }
}
