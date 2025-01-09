using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Contracts;
using Entities.Dto;
using Entities.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Repository;

namespace ProductManagement.Api.Controllers
{
    [Route("api/[controller]s")]
    [Authorize]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private ILoggerManager _logger;
        private IRepositoryWrapper _repoWrapper;
        private IMapper _mapper;

        private readonly IDistributedCache _cache;

        public ProductController(ILoggerManager logger, IRepositoryWrapper repoWrapper, IMapper mapper, IDistributedCache cache)
        {
            _logger = logger;
            _repoWrapper = repoWrapper;
            _mapper = mapper;
            _cache = cache;
        }

        /// <summary>
        /// Get all products
        /// </summary>
        /// <returns></returns>
        [HttpPost("get-all", Name = "GetAllProducts")]
        public async Task<IActionResult> GetAllProducts([FromBody] ProductFilterDto filter = null)
        {

            string cacheKey = $"GetAllProducts_{filter?.Name}_{filter?.StartPrice}_{filter?.EndPrice}";
            var cachedProducts = await _cache.GetStringAsync(cacheKey);

            if (string.IsNullOrEmpty(cachedProducts))
            {
                var products = await _repoWrapper.Product.GetAllProducts(filter);
                _logger.LogInfo($"Returned all products from the database.");

                var productResult = _mapper.Map<IEnumerable<ProductDto>>(products);

                var cacheEntryOptions = new DistributedCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(5));

                await _cache.SetStringAsync(cacheKey, JsonSerializer.Serialize(productResult), cacheEntryOptions);

                return Ok(new ApiResponse<IEnumerable<ProductDto>>
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Products returned successfully",
                    Data = productResult
                });
            }
            else
            {
                var res = await _repoWrapper.Product.GetAllProducts(filter);
                var productResults = _mapper.Map<IEnumerable<ProductDto>>(res);
                return Ok(new ApiResponse<IEnumerable<ProductDto>>
                {
                    StatusCode = StatusCodes.Status200OK,
                    Message = "Products returned successfully",
                    Data = productResults
                });
            }
        }

        /// <summary>
        /// Get product by specific id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById(int id)
        {
            var response = new ApiResponse<ProductDto>();
            var product = await _repoWrapper.Product.GetProductById(id);

            if (product is null)
            {
                var message = $"Product with id: {id}, hasn't been found in db.";
                _logger.LogError(message);
                throw new KeyNotFoundException(message);
            }

            var productResult = _mapper.Map<ProductDto>(product);

            response.StatusCode = StatusCodes.Status200OK;
            response.Message = $"Returned product with id: {id}";
            response.Data = productResult;
            return Ok(response);
        }


        /// <summary>
        /// Add new product
        /// </summary>
        /// <param name="productDto"></param>
        /// <returns></returns>
        [HttpPost]
        public async Task<IActionResult> CreateProductAsync([FromBody] ProductCreationDto productDto)
        {
            var productEntity = _mapper.Map<Product>(productDto);

            await _repoWrapper.Product.CreatProduct(productEntity);
            await _repoWrapper.Save();

            var createdProduct = _mapper.Map<ProductDto>(productEntity);

            return CreatedAtRoute("", new { id = createdProduct.Id }, createdProduct);
        }

        /// <summary>
        /// Update specific product
        /// </summary>
        /// <param name="id"></param>
        /// <param name="product"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] ProductUpdateDto product)
        {
            var productEntity = await _repoWrapper.Product.GetProductById(id);

            if (productEntity is null)
            {
                _logger.LogError($"Product with id: {id}, is not found.");
                throw new KeyNotFoundException($"Product with id: {id}, is not found.");
            }

            _mapper.Map(product, productEntity);

            await _repoWrapper.Product.UpdateProduct(productEntity);
            await _repoWrapper.Save();

            return NoContent();
        }

        /// <summary>
        /// Delete product by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _repoWrapper.Product.GetProductById(id);

            if (product is null)
            {
                var message = $"Product with id: {id} is not found.";
                _logger.LogError(message);

                throw new KeyNotFoundException(message);
            }

            await _repoWrapper.Product.DeleteProduct(product);
            await _repoWrapper.Save();

            return NoContent();
        }



    }
}
