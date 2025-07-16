using AutoMapper;
using CloneTwiAPI.Models;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenericController<T, TEntity> : ControllerBase
        where T : class
        where TEntity : class
    {
        protected readonly CloneTwiContext _context;
        private readonly UserGetter _userGetter;
        private readonly IMapper _mapper;

        protected GenericController(CloneTwiContext context, UserGetter userGetter, IMapper mapper)
        {
            _context = context;
            _userGetter = userGetter;
            _mapper = mapper;
        }

        [Authorize]
        protected async Task<T> AddAsync([FromBody] T model, string name, bool userBool, int? messageId)
        {
            var entity = _mapper.Map<TEntity>(model);

            if (userBool)
            {
                var user = await _userGetter.GetUser();
                var userProp = entity!.GetType().GetProperty($"{name}UserId");

                if (userProp != null)
                    userProp.SetValue(entity, user!.Id);
            }

            if (messageId != null)
            {
                var messageProp = entity!.GetType().GetProperty($"{name}MessageId");

                if (messageProp != null)
                    messageProp.SetValue(entity, messageId);
            }

            await _context.Set<TEntity>().AddAsync(entity!);
            await _context.SaveChangesAsync();
            return model;
        }


        [HttpDelete]
        [Authorize]
        protected async Task<bool> RemoveAsync([FromBody] T model)
        {
            var entity = _mapper.Map<TEntity>(model);
            if (entity == null) return false;

            var success = _context.Set<TEntity>().Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }

        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await _context.Set<TEntity>().FindAsync(id);
            return result is not null ? Ok(result) : NotFound();
        }

        [Authorize]
        public async Task<ActionResult<IEnumerable<T>>> GetAllAsync()
        {
            var entities = await _context.Set<TEntity>().ToListAsync();
            var dtos = _mapper.Map<IEnumerable<T>>(entities);
            return new OkObjectResult(dtos);
        }
    }
}
