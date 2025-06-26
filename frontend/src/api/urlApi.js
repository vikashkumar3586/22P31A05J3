import { loggingApi } from './loggingApi';
const generateShortcode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
export const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
export const urlApi = {
  async createShortUrl(originalUrl, customShortcode, validityMinutes = 30) {
    try {
      loggingApi.logInfo('api', `Creating short URL for: ${originalUrl}`).catch(() => {});
      if (!isValidUrl(originalUrl)) {
        throw new Error('Invalid URL format');
      }
      const shortcode = customShortcode || generateShortcode();
      const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      if (customShortcode && existingUrls.some(url => url.shortcode === customShortcode)) {
        throw new Error('Custom shortcode already exists');
      }
      const urlData = {
        id: Date.now().toString(),
        originalUrl,
        shortcode,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + validityMinutes * 60 * 1000).toISOString(),
        clicks: 0,
        clickData: []
      };
      existingUrls.push(urlData);
      localStorage.setItem('shortenedUrls', JSON.stringify(existingUrls));
      loggingApi.logInfo('api', `Short URL created successfully: ${shortcode}`).catch(() => {});
      
      return {
        shortUrl: `http://localhost:3000/${shortcode}`,
        originalUrl,
        shortcode,
        expiresAt: urlData.expiresAt,
        createdAt: urlData.createdAt
      };
    } catch (error) {
      // Non-blocking logging
      loggingApi.logError('api', `Failed to create short URL: ${error.message}`).catch(() => {});
      throw error;
    }
  },

  async getUrlByShortcode(shortcode) {
    try {
      const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      const urlData = existingUrls.find(url => url.shortcode === shortcode);
      
      if (!urlData) {
        throw new Error('Short URL not found');
      }

      // Check if URL has expired
      if (new Date() > new Date(urlData.expiresAt)) {
        throw new Error('Short URL has expired');
      }

      return urlData;
    } catch (error) {
      // Non-blocking logging
      loggingApi.logError('api', `Failed to get URL by shortcode: ${error.message}`).catch(() => {});
      throw error;
    }
  },

  async recordClick(shortcode, clickData = {}) {
    try {
      const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      const urlIndex = existingUrls.findIndex(url => url.shortcode === shortcode);
      
      if (urlIndex === -1) {
        throw new Error('Short URL not found');
      }
      existingUrls[urlIndex].clicks += 1;
      existingUrls[urlIndex].clickData.push({
        timestamp: new Date().toISOString(),
        source: clickData.source || 'direct',
        location: clickData.location || 'Unknown'
      });

      localStorage.setItem('shortenedUrls', JSON.stringify(existingUrls));
      loggingApi.logInfo('api', `Click recorded for shortcode: ${shortcode}`).catch(() => {});
      
      return existingUrls[urlIndex];
    } catch (error) {
      loggingApi.logError('api', `Failed to record click: ${error.message}`).catch(() => {});
      throw error;
    }
  },

  async getAllUrls() {
    try {
      const existingUrls = JSON.parse(localStorage.getItem('shortenedUrls') || '[]');
      loggingApi.logInfo('api', `Retrieved ${existingUrls.length} URLs`).catch(() => {});
      return existingUrls.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      loggingApi.logError('api', `Failed to get all URLs: ${error.message}`).catch(() => {});
      throw error;
    }
  }
};
