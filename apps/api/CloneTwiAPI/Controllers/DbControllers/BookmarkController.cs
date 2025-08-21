using CloneTwiAPI.DTOs;
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

        [HttpPost("addbookmark")]
        //[Authorize]

        public async Task<IActionResult> AddBookmark([FromBody] BookmarkDTO dto) => await _service.AddBookmark(dto);

        [HttpDelete("removebookmark/{messageId}")]
        //[Authorize]
        public async Task<IActionResult> RemoveBookmark([FromRoute] int messageId) => await _service.RemoveBookmark(messageId);

        [HttpGet("getallbookmarks")]
        public async Task<ActionResult<BookmarkMessage>> GetAllBookmarks() => await _service.GetAllBookmarks();

        [HttpGet("getallbookmarksforuser")]
        [Authorize]
        public async Task<IEnumerable<BookmarkDTO>> GetAllBookmarksForUser() => await _service.GetAllBookmarksForUser();
    }
}
