using Contracts;
using Entities;


namespace Repository;

public class RepositoryWrapper : IRepositoryWrapper
{
    private RepositoryContext _repoContext;
    private IProductRepository _product;
    public RepositoryWrapper(RepositoryContext repositoryContext)
    {
        _repoContext = repositoryContext;
    }

    public IProductRepository Product
    {
        get
        {
            if (_product == null)
            {
                _product = new ProductRepository(_repoContext);
            }

            return _product;
        }
    }

    public async Task Save() => await _repoContext.SaveChangesAsync();

}

