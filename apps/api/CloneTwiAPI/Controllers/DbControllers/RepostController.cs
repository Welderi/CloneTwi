using CloneTwiAPI.DTOs;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RepostController : ControllerBase
    {
        private readonly RepostService _service;
        public RepostController(RepostService service)
        {
            _service = service;
        }

        [Authorize]
        [HttpPost("addrepost")]
        public async Task<IActionResult> AddRepost([FromForm] RepostDTO dto) => await _service.AddRepost(dto);

        [Authorize]
        [HttpDelete("removerepost/{messageId}")]
        public async Task<IActionResult> RemoveRepost([FromRoute] int messageId) => await _service.RemoveRepost(messageId);

        [Authorize]
        [HttpGet("getallrepostsforuser")]
        public async Task<IEnumerable<RepostDTO>> GetAllRepostsForUser() => await _service.GetAllRepostsForUser();

        [HttpGet("getallrepostsforfollowers")]
        public async Task<ActionResult<RepostMessage>> GetAllRepostsForFollowers() => await _service.GetAllRepostsForFollowers();
    }
}
