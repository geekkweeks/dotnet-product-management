using System;
using Contracts;
using NLog;

namespace LoggerService;

public class LoggerManager : ILoggerManager
{
    private static ILogger logger = LogManager.GetCurrentClassLogger();

    /// <summary>
    /// Log debug message
    /// </summary>
    /// <param name="message"></param>
    public void LogDebug(string message) => logger.Debug(message);

    /// <summary>
    /// Log error message
    /// </summary>
    /// <param name="message"></param>
    public void LogError(string message) => logger.Error(message);

    /// <summary>
    /// Log info message
    /// </summary>
    /// <param name="message"></param>
    public void LogInfo(string message) => logger.Info(message);

    /// <summary>
    /// Log warn message
    /// </summary>
    /// <param name="message"></param>
    public void LogWarn(string message) => logger.Warn(message);
}
