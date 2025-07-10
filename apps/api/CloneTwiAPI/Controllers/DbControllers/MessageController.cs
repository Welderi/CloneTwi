using CloneTwiAPI.DbServices;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : GenericController<Message>
    {
        public MessageController(IRepository<Message> repo) : base(repo) { }
    }
}
