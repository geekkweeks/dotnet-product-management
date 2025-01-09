using System;
using Contracts;
using Entities;
using Entities.Dto;
using Entities.Models;

namespace Repository;

public class ProductRepository : RepositoryBase<Product>, IProductRepository
{
    public ProductRepository(RepositoryContext repositoryContext) : base(repositoryContext)
    {
    }

    public async Task CreatProduct(Product product) => Add(product);

    public async Task DeleteProduct(Product product) => Delete(product);

    public async Task<IEnumerable<Product>> GetAllProducts(ProductFilterDto filter = null)
    {
        IQueryable<Product> query = FindAll();

        if (filter is null)
            return query.OrderByDescending(ts => ts.CreatedAt).ToList();

        if (!string.IsNullOrEmpty(filter.Name))
        {
            query = query.Where(ts => ts.Name.Contains(filter.Name));
        }

        if (filter.StartPrice.HasValue && !filter.EndPrice.HasValue)
        {
            query = query.Where(ts => ts.Price >= filter.StartPrice);
        }

        if (!filter.StartPrice.HasValue && filter.EndPrice.HasValue)
        {
            query = query.Where(ts => ts.Price <= filter.EndPrice);
        }

        if (filter.StartPrice.HasValue && filter.EndPrice.HasValue)
        {
            query = query.Where(ts => ts.Price >= filter.StartPrice && ts.Price <= filter.EndPrice);
        }

        return query.OrderByDescending(ts => ts.CreatedAt).ToList();
    }


    public async Task<Product> GetProductById(int id) => FindByCondition(c => c.Id.Equals(id))
            .FirstOrDefault();

    public async Task UpdateProduct(Product product) => Update(product);
}
