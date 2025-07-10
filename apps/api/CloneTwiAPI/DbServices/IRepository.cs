namespace CloneTwiAPI.DbServices
{
    public interface IRepository<T> where T : class
    {
        Task<T> AddAsync(T model);
        Task<bool> RemoveAsync(T model);
        Task<T?> GetByIdAsync(int id);
        Task<IEnumerable<T>> GetAllAsync();
    }
}
