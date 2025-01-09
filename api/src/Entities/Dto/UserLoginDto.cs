using System;
using System.ComponentModel.DataAnnotations;

namespace Entities.Dto;

public class UserLoginDto
{
    [Required]
    public string Username { get; set; }

    [Required]
    public string Password { get; set; }

}
