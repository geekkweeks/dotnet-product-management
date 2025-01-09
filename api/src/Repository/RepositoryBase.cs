using System.Linq.Expressions;
using Contracts;
using Entities;
using Microsoft.EntityFrameworkCore;
namespace Repository;

public class RepositoryBase<T> : IRepositoryBase<T> where T : class
{
    protected RepositoryContext RepositoryContext { get; set; }
    public RepositoryBase(RepositoryContext repositoryContext)
    {
        RepositoryContext = repositoryContext;
    }

    /// <summary>
    /// Add entity to the database
    /// </summary>
    /// <param name="entity"></param>
    public void Add(T entity) => RepositoryContext.Set<T>().Add(entity);

    /// <summary>
    /// Delete entity from the database
    /// </summary>
    /// <param name="entity"></param>
    public void Delete(T entity) => RepositoryContext.Set<T>().Remove(entity);

    /// <summary>
    /// Find all entities in the database
    /// </summary>
    /// <returns></returns>
    public IQueryable<T> FindAll() => RepositoryContext.Set<T>().AsNoTracking();

    /// <summary>
    /// Find entities by specific condition
    /// </summary>
    /// <param name="expression"></param>
    /// <returns></returns>
    public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression) =>
         RepositoryContext.Set<T>().Where(expression).AsNoTracking();

    /// <summary>
    /// Update entity in the database
    /// </summary>
    /// <param name="entity"></param>
    public void Update(T entity) => RepositoryContext.Set<T>().Update(entity);
}

