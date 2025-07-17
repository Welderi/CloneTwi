using AutoMapper;
using CloneTwiAPI.Attributes;
using CloneTwiAPI.Models;
using CloneTwiAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Controllers.DbControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GenericController<TDto, TEntity> : ControllerBase
        where TDto : class
        where TEntity : class
    {
        protected readonly CloneTwiContext _context;
        private readonly UserGetter _userGetter;
        protected readonly IMapper _mapper;

        protected GenericController(CloneTwiContext context, UserGetter userGetter, IMapper mapper)
        {
            _context = context;
            _userGetter = userGetter;
            _mapper = mapper;
        }

        [Authorize]
        protected async Task<TDto> AddAsync([FromBody] TDto model,
            bool userBool = false, int? messageId = null)
        {
            var entity = _mapper.Map<TEntity>(model);

            if (userBool)
            {
                var user = await _userGetter.GetUser();

                var userProp = entity!
                    .GetType()
                    .GetProperties()
                    .FirstOrDefault(p => Attribute.IsDefined(p, typeof(UserIdAttribute)));

                if (userProp != null)
                {
                    userProp.SetValue(entity, user!.Id);
                }
            }

            if (messageId != null)
            {
                var messageProp = entity!
                    .GetType()
                    .GetProperties()
                    .FirstOrDefault(p => Attribute.IsDefined(p, typeof(MessageIdAttribute)));

                if (messageProp != null)
                {
                    messageProp.SetValue(entity, messageId);
                }
            }

            await _context.Set<TEntity>().AddAsync(entity!);
            await _context.SaveChangesAsync();
            return model;
        }


        [HttpDelete]
        [Authorize]
        protected async Task<bool> RemoveAsync([FromBody] TDto model)
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
        public async Task<ActionResult<IEnumerable<TDto>>> GetAllAsync()
        {
            var entities = await _context.Set<TEntity>().ToListAsync();
            var dtos = _mapper.Map<IEnumerable<TDto>>(entities);
            return new OkObjectResult(dtos);
        }
    }
}
