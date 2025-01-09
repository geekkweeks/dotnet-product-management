using System;
using Contracts;

namespace Repository;

public interface IRepositoryWrapper
{
    IProductRepository Product { get; }
    Task Save();
}