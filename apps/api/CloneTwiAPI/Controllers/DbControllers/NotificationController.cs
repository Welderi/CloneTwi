using CloneTwiAPI.DTOs;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly NotificationService _service;
        public NotificationController(NotificationService service)
        {
            _service = service;
        }

        [HttpGet("getallnotifications")]
        public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetAllNotifications()
            => await _service.GetAllNotifications();
    }
}
