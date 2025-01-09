using System;
using Entities;
using Entities.Dto;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Repository;

namespace ProductManagement.Api.Tests;

public class ProductRepositoryTest
{
    private readonly DbContextOptions<RepositoryContext> _dbContextOptions;
    private readonly RepositoryContext _context;
    private readonly ProductRepository _repository;


    public ProductRepositoryTest()
    {
        _dbContextOptions = new DbContextOptionsBuilder<RepositoryContext>()
                .UseSqlite("Data Source=productapp.db")
                .Options;
        _context = new RepositoryContext(_dbContextOptions);
        _context.Database.OpenConnection();
        _context.Database.EnsureCreated();
        _repository = new ProductRepository(_context);
    }

    [Fact]
    public async Task CreateProduct_AddsProductToDatabase()
    {
        using (var context = new RepositoryContext(_dbContextOptions))
        {
            // Arrange
            var repository = new ProductRepository(context);
            var entity = new Product { Name = "Baju Anak", Description = "Kualitas import", Price = 10.0M };

            // Act
            await repository.CreatProduct(entity);
            await context.SaveChangesAsync();

            // Assert
            // Assert.Equal(1, context.Products.Count());
            var createdProduct = context.Products.First(f => f.Id == entity.Id);
            Assert.Equal(1, createdProduct.Id);
            Assert.Equal("Baju Anak", createdProduct.Name);
        }
    }

    [Fact]
    public async Task GetAllProducts_ReturnsAllProducts()
    {
        // Arrange
        _context.Products.Add(new Product { Name = "Product ZXC Test", Description = "Description 1", Price = 10.0M });
        await _context.SaveChangesAsync();

        var filter = new ProductFilterDto { Name = "ZXC Test" };
        // Act
        var products = await _repository.GetAllProducts(filter);

        // Assert
        Assert.Equal(1, products.Count());
    }

    [Fact]
    public async Task UpdateProduct_UpdatesProductInDatabase()
    {
        // Arrange
        var product = new Product { Name = "New Balance", Description = "Test Description", Price = 10.0M };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Act
        product.Name = "Updated Product";
        await _repository.UpdateProduct(product);
        await _context.SaveChangesAsync();

        // Assert
        var updatedProduct = await _context.Products.FindAsync(product.Id);
        Assert.Equal("Updated Product", updatedProduct?.Name);
    }

    [Fact]
    public async Task GetProductById_ReturnsProduct()
    {
        // Arrange
        var product = new Product { Name = "Test Product", Description = "Test Description", Price = 10.0M };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Act
        var result = await _repository.GetProductById(product.Id);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Product", result.Name);
    }


    [Fact]
    public async Task DeleteProduct_RemovesProductFromDatabase()
    {
        // Arrange
        var product = new Product { Name = "Test Product", Description = "Test Description", Price = 10.0M };
        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Act
        await _repository.DeleteProduct(product);
        await _context.SaveChangesAsync();

        // Assert
        var productById = await _context.Products.FirstOrDefaultAsync(f => f.Id == product.Id);
        Assert.Null(productById);
    }
}
