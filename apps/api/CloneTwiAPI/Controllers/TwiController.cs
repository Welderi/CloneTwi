using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TwiController : ControllerBase
    {
        [HttpGet]
        public IActionResult Ping() => Ok("Pong");
    }
}
