using CloneTwiAPI.DbServices;
using Microsoft.AspNetCore.Mvc;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenericController<T> : ControllerBase
        where T : class
    {
        protected readonly IRepository<T> _repository;

        protected GenericController(IRepository<T> repository)
        {
            _repository = repository;
        }

        [HttpPost]
        protected async Task<IActionResult> AddAsync([FromBody] T model)
        {
            var result = await _repository.AddAsync(model);
            return Ok(result);
        }

        [HttpDelete]
        protected async Task<IActionResult> RemoveAsync([FromBody] T model)
        {
            var success = await _repository.RemoveAsync(model);
            return success ? Ok() : NotFound();
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await _repository.GetByIdAsync(id);
            return result is not null ? Ok(result) : NotFound();
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllAsync()
        {
            var result = await _repository.GetAllAsync();
            return Ok(result);
        }
    }
}
