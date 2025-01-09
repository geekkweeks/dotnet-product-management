using System;

namespace Entities.Dto;

public class ProductFilterDto
{
    public string Name { get; set; }
    public decimal? StartPrice { get; set; }
    public decimal? EndPrice { get; set; }
}
