
export class LoggingApi {
  constructor() {
    this.baseUrl = 'http://localhost:8080'; 
    this.enabled = false;
  }

  async log(level, packageName, message, stack = 'frontend') {
    console.log(`[${level.toUpperCase()}] ${packageName}: ${message}`);
    if (!this.enabled) {
      return { success: true, source: 'console' };
    }
    try {
      const response = await fetch(`${this.baseUrl}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          stack,
          level,
          package: packageName,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.warn('Logging middleware not available, using console only:', error.message);
      return { success: false, error: error.message, source: 'console' };
    }
  }
  async logError(packageName, message) {
    return this.log('error', packageName, message);
  }
  async logInfo(packageName, message) {
    return this.log('info', packageName, message);
  }
  async logWarning(packageName, message) {
    return this.log('warning', packageName, message);
  }
  async logDebug(packageName, message) {
    return this.log('debug', packageName, message);
  }

  
  enableMiddleware() {
    this.enabled = true;
  }

  disableMiddleware() {
    this.enabled = false;
  }
}

export const loggingApi = new LoggingApi();
