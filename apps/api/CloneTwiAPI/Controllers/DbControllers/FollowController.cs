using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FollowController : ControllerBase
    {
        private readonly FollowService _service;

        public FollowController(FollowService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("addfollow")]
        public async Task<IActionResult> Follow([FromBody] string userId) => await _service.FollowOrUnfollow(userId, true);

        [Authorize]
        [HttpPost("removefollow")]
        public async Task<IActionResult> Unfollow([FromBody] string userId) => await _service.FollowOrUnfollow(userId, false);

        [Authorize]
        [HttpGet("getisfollowed/{userId}")]
        public async Task<IActionResult> IsFollowed([FromRoute] string userId) => await _service.IsFollowed(userId);
    }
}
