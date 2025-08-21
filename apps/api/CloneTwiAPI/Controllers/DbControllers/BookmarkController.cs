using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookmarkController : ControllerBase
    {
        private readonly BookmarkService _service;
        public BookmarkController(BookmarkService service)
        {
            _service = service;
        }

        [HttpPost("addbookmark/{messageId}")]
        [Authorize]

        public async Task<IActionResult> AddBookmark([FromRoute] int messageId) => await _service.AddBookmark(messageId);

        [HttpDelete("removebookmark/{messageId}")]
        [Authorize]
        public async Task<IActionResult> RemoveBookmark([FromRoute] int messageId) => await _service.RemoveBookmark(messageId);
    }
}
