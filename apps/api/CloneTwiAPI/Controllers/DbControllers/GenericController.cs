using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenericController<T> : ControllerBase
        where T : class
    {
        protected readonly CloneTwiContext _repository;

        protected GenericController(CloneTwiContext repository)
        {
            _repository = repository;
        }

        [HttpPost]
        protected async Task<T> AddAsync([FromBody] T model)
        {
            await _repository.Set<T>().AddAsync(model);
            await _repository.SaveChangesAsync();
            return model;
        }

        [HttpDelete]
        protected async Task<bool> RemoveAsync([FromBody] T model)
        {
            var success = _repository.Set<T>().Remove(model);
            return await _repository.SaveChangesAsync() > 0;
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await _repository.Set<T>().FindAsync(id);
            return result is not null ? Ok(result) : NotFound();
        }

        [HttpGet("all")]
        public async Task<IEnumerable<T>> GetAllAsync()
        {
            return await _repository.Set<T>().ToListAsync();
        }
    }
}
