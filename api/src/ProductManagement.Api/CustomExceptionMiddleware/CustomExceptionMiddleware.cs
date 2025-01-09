using System.ComponentModel.DataAnnotations;
using System.Data.Common;
using System.Net;
using Contracts;
using Entities.Models;

namespace ProductManagement.Api.CustomExceptionMiddleware;


public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILoggerManager _logger;

    public ExceptionMiddleware(ILoggerManager logger, RequestDelegate next)
    {
        _logger = logger;
        _next = next;
    }

    public async Task InvokeAsync(HttpContext httpContext)
    {
        try
        {
            await _next(httpContext);
        }
        catch (Exception ex)
        {
            _logger.LogError($"Something went wrong: {ex}");

            if (ex.InnerException != null)
                await HandleExceptionAsync(httpContext, ex.InnerException);
            else
                await HandleExceptionAsync(httpContext, ex);
        }

        if (!httpContext.Response.HasStarted && httpContext.Items["ModelStateErrors"] is List<string> errors)
        {
            var errorDetails = new ApiResponse<string>
            {
                StatusCode = StatusCodes.Status400BadRequest,
                Message = "Validation errors occurred.",
                Errors = errors
            };

            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = errorDetails.StatusCode;

            await httpContext.Response.WriteAsync(errorDetails.ToString());
        }
    }

    private async Task HandleExceptionAsync(HttpContext httpContext, Exception ex)
    {
        HttpStatusCode statusCode;
        string message;

        httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
        httpContext.Response.ContentType = "application/json";

        switch (ex)
        {
            case KeyNotFoundException:
                statusCode = HttpStatusCode.NotFound;
                message = ex.Message;
                httpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
                break;
            case ArgumentException:
                statusCode = HttpStatusCode.BadRequest;
                message = ex.Message;
                httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case ValidationException or InvalidOperationException:
                statusCode = HttpStatusCode.BadRequest;
                message = ex.Message;
                httpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
                break;

            case UnauthorizedAccessException:
                statusCode = HttpStatusCode.Unauthorized;
                message = ex.Message;
                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                break;

            case DbException:
                statusCode = HttpStatusCode.InternalServerError;
                message = ex.Message;
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;

            default:
                statusCode = HttpStatusCode.InternalServerError;
                message = "An unexpected error occurred.";
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                break;
        }

        var response = new ApiResponse<string>
        {
            StatusCode = (int)statusCode,
            Message = message,
            Errors = new List<string> { ex.Message }
        };
        await httpContext.Response.WriteAsync(response.ToString());
    }
}

