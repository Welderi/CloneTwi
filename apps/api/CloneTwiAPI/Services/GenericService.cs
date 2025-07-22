using AutoMapper;
using CloneTwiAPI.Attributes;
using CloneTwiAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.Services
{
    public class GenericService<TDto, TEntity>
        where TDto : class
        where TEntity : class
    {
        protected readonly CloneTwiContext _context;
        private readonly UserGetter _userGetter;
        private readonly IMapper? _mapper;

        public GenericService(CloneTwiContext context, UserGetter userGetter, IMapper? mapper = null)
        {
            _context = context;
            _userGetter = userGetter;
            _mapper = mapper;
        }

        public async Task<IActionResult> AddAsync(TDto? model = null,
            bool userBool = false, int? messageId = null, TEntity? entity = null)
        {
            if (entity == null)
                entity = _mapper.Map<TEntity>(model);

            if (userBool)
            {
                var user = await _userGetter.GetUser();

                if (user == null)
                    return new UnauthorizedObjectResult(user);

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
            return new OkObjectResult(entity);
        }

        public async Task AddRangeAsync<TEntityToAdd>(List<TEntityToAdd> entities) where TEntityToAdd : class
        {
            await _context.Set<TEntityToAdd>().AddRangeAsync(entities);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> RemoveAsync([FromBody] TDto model, TEntity? entity = null)
        {
            if (entity == null)
                entity = _mapper.Map<TEntity>(model);

            var success = _context.Set<TEntity>().Remove(entity);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var result = await _context.Set<TEntity>().FindAsync(id);
            return result is not null ? new OkObjectResult(result) : new NotFoundObjectResult(result);
        }

        public async Task<ActionResult<IEnumerable<TDto>>> GetAllAsync()
        {
            var entities = await _context.Set<TEntity>().ToListAsync();
            var dtos = _mapper.Map<IEnumerable<TDto>>(entities);
            return new OkObjectResult(dtos);
        }
    }
}
