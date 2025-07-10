using CloneTwiAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace CloneTwiAPI.DbServices
{
    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly CloneTwiContext _context;
        private readonly DbSet<T> _dbSet;
        public Repository(CloneTwiContext context)
        {
            context = _context;
            _dbSet = context.Set<T>();
        }

        public async Task<T> AddAsync(T model)
        {
            _dbSet.Add(model);
            await _context.SaveChangesAsync();
            return model;
        }

        public async Task<bool> RemoveAsync(T model)
        {
            _dbSet.Remove(model);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<T?> GetByIdAsync(int id) => await _dbSet.FindAsync(id);

        public async Task<IEnumerable<T>> GetAllAsync() => await _dbSet.ToListAsync();
    }
}