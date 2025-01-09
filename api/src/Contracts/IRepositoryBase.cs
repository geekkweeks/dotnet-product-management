namespace Contracts;

public interface IRepositoryBase<T>
{
    IQueryable<T> FindAll();
    IQueryable<T> FindByCondition(System.Linq.Expressions.Expression<System.Func<T, bool>> expression);
    void Add(T entity);
    void Update(T entity);
    void Delete(T entity);
}
