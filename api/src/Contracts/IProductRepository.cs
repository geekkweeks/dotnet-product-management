using System;
using Entities.Dto;
using Entities.Models;

namespace Contracts;

public interface IProductRepository
{

    /// <summary>
    /// Get all product
    /// </summary>
    /// <returns></returns>
    Task<IEnumerable<Product>> GetAllProducts(ProductFilterDto filter = null);

    /// <summary>
    /// Get product by id
    /// </summary>
    /// <param name="id"></param>
    /// <returns></returns>
    Task<Product> GetProductById(int id);

    /// <summary>
    /// Add new Product
    /// </summary>
    /// <param name="product"></param>
    Task CreatProduct(Product product);

    /// <summary>
    /// Update sepecific product
    /// </summary>
    /// <param name="product"></param>
    Task UpdateProduct(Product product);


    /// <summary>
    /// Delete sepecific product
    /// </summary>
    /// <param name="product"></param>
    Task DeleteProduct(Product product);
}
