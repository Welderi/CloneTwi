using CloneTwiAPI.DTOs;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InterestController : ControllerBase
    {
        private readonly InterestService _service;

        public InterestController(InterestService service)
        {
            _service = service;
        }

        [HttpPost("addinterest")]
        public async Task<IActionResult> AddInterest([FromBody] InterestDTO dto) => await _service.AddInterest(dto);

        [HttpPost("addrangeinterests")]
        public async Task<IActionResult> AddRangeInterest([FromBody] List<InterestDTO> dtos) => await _service.AddRangeInterests(dtos);

        [HttpDelete("removeinterest/{topic}")]
        public async Task<IActionResult> RemoveInterest([FromRoute] string topic) => await _service.RemoveInterest(topic);

        [HttpGet("getpostsbyinterest")]
        public async Task<List<MessageDTO>> GetPostsByInterest()
            => await _service.GetPostsByInterest();

        [HttpGet("getallinterestsforuser")]
        public async Task<IEnumerable<InterestDTO>> GetAllInterestsForUser() => await _service.GetAllInterestsForUser();
    }
}
