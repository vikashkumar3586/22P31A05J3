import { useState, useCallback } from 'react';
import { urlApi } from '../api/urlApi';
import { useUrlContext } from '../state/urlContext';
import { loggingApi } from '../api/loggingApi';

export const useUrlShortener = () => {
  const { state, actions } = useUrlContext();
  const [bulkResults, setBulkResults] = useState([]);

  const createShortUrl = useCallback(async (originalUrl, customShortcode, validityMinutes) => {
    try {
      actions.setLoading(true);
      actions.clearError();
      
      // Non-blocking logging
      loggingApi.logInfo('hook', `Creating short URL for: ${originalUrl}`).catch(() => {});
      
      const result = await urlApi.createShortUrl(originalUrl, customShortcode, validityMinutes);
      actions.addUrl(result);
      
      return result;
    } catch (error) {
      // Non-blocking logging
      loggingApi.logError('hook', `Failed to create short URL: ${error.message}`).catch(() => {});
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const createBulkShortUrls = useCallback(async (urlRequests) => {
    try {
      actions.setLoading(true);
      actions.clearError();
      setBulkResults([]);
      
      // Non-blocking logging
      loggingApi.logInfo('hook', `Creating ${urlRequests.length} short URLs`).catch(() => {});
      
      const results = [];
      const errors = [];

      for (let i = 0; i < urlRequests.length; i++) {
        const request = urlRequests[i];
        try {
          const result = await urlApi.createShortUrl(
            request.originalUrl,
            request.customShortcode,
            request.validityMinutes
          );
          results.push(result);
          actions.addUrl(result);
        } catch (error) {
          errors.push({
            index: i,
            url: request.originalUrl,
            error: error.message
          });
        }
      }

      setBulkResults(results);
      
      if (errors.length > 0) {
        const errorMessage = `Failed to create ${errors.length} out of ${urlRequests.length} URLs`;
        // Non-blocking logging
        loggingApi.logWarning('hook', errorMessage).catch(() => {});
        actions.setError(errorMessage);
      }

      return { results, errors };
    } catch (error) {
      // Non-blocking logging
      loggingApi.logError('hook', `Bulk URL creation failed: ${error.message}`).catch(() => {});
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const loadAllUrls = useCallback(async () => {
    try {
      actions.setLoading(true);
      actions.clearError();
      
      const urls = await urlApi.getAllUrls();
      actions.setUrls(urls);
      
      return urls;
    } catch (error) {
      // Non-blocking logging
      loggingApi.logError('hook', `Failed to load URLs: ${error.message}`).catch(() => {});
      actions.setError(error.message);
      throw error;
    } finally {
      actions.setLoading(false);
    }
  }, [actions]);

  const recordUrlClick = useCallback(async (shortcode, clickData) => {
    try {
      const updatedUrl = await urlApi.recordClick(shortcode, clickData);
      actions.updateUrl(updatedUrl);
      return updatedUrl;
    } catch (error) {
      // Non-blocking logging
      loggingApi.logError('hook', `Failed to record click: ${error.message}`).catch(() => {});
      throw error;
    }
  }, [actions]);

  const redirectToOriginalUrl = useCallback(async (shortcode) => {
    try {
      // Non-blocking logging
      loggingApi.logInfo('hook', `Redirecting shortcode: ${shortcode}`).catch(() => {});
      
      const urlData = await urlApi.getUrlByShortcode(shortcode);
      
      // Record the click
      await recordUrlClick(shortcode, {
        source: 'direct',
        location: 'Local' // In a real app, you'd get actual geolocation
      });

      // Redirect to original URL
      window.location.href = urlData.originalUrl;
      
      return urlData;
    } catch (error) {
      // Non-blocking logging
      loggingApi.logError('hook', `Redirection failed: ${error.message}`).catch(() => {});
      actions.setError(error.message);
      throw error;
    }
  }, [actions, recordUrlClick]);

  return {
    urls: state.urls,
    loading: state.loading,
    error: state.error,
    bulkResults,
    createShortUrl,
    createBulkShortUrls,
    loadAllUrls,
    recordUrlClick,
    redirectToOriginalUrl,
    clearError: actions.clearError
  };
};
