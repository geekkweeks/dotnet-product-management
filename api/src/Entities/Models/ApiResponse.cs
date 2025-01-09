using System;
using System.Text.Json;

namespace Entities.Models;


public class ApiResponse<T>
{
    public int StatusCode { get; set; }
    public string Message { get; set; }
    public T Data { get; set; }
    public List<string> Errors { get; set; }
    public ApiResponse()
    {
        Errors = new List<string>();
    }
    public override string ToString() => JsonSerializer.Serialize(this, new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = true
    });
}
