using System;
using System.ComponentModel.DataAnnotations;

namespace Entities.Dto;

public class ProductCreationDto
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }
    [Required]
    public decimal Price { get; set; }

}
