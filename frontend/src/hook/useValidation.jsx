import { useState, useCallback } from 'react';
import { isValidUrl } from '../api/urlApi';
import { loggingApi } from '../api/loggingApi';

export const useValidation = () => {
  const [errors, setErrors] = useState({});

  const validateUrl = useCallback((url) => {
    if (!url || url.trim() === '') {
      return 'URL is required';
    }
    
    if (!isValidUrl(url)) {
      return 'Please enter a valid URL';
    }
    
    return null;
  }, []);

  const validateShortcode = useCallback((shortcode) => {
    if (!shortcode) return null;
    
    if (shortcode.length < 3 || shortcode.length > 10) {
      return 'Shortcode must be between 3 and 10 characters';
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(shortcode)) {
      return 'Shortcode can only contain letters and numbers';
    }
    
    return null;
  }, []);

  const validateValidity = useCallback((validity) => {
    if (!validity) return null;
    
    const validityNum = parseInt(validity);
    if (isNaN(validityNum) || validityNum <= 0) {
      return 'Validity must be a positive number';
    }
    
    if (validityNum > 10080) { // 7 days in minutes
      return 'Validity cannot exceed 7 days (10080 minutes)';
    }
    
    return null;
  }, []);

  const validateUrlRequest = useCallback(async (urlRequest) => {
    const newErrors = {};
    
    try {
      // Log without await to avoid blocking on logging errors
      loggingApi.logDebug('hook', `Validating URL request: ${urlRequest.originalUrl}`).catch(() => {});
      
      const urlError = validateUrl(urlRequest.originalUrl);
      if (urlError) newErrors.originalUrl = urlError;
      
      const shortcodeError = validateShortcode(urlRequest.customShortcode);
      if (shortcodeError) newErrors.customShortcode = shortcodeError;
      
      const validityError = validateValidity(urlRequest.validityMinutes);
      if (validityError) newErrors.validityMinutes = validityError;
      
      return {
        isValid: Object.keys(newErrors).length === 0,
        errors: newErrors
      };
    } catch (error) {
      loggingApi.logError('hook', `Validation failed: ${error.message}`).catch(() => {});
      return {
        isValid: false,
        errors: { general: 'Validation failed' }
      };
    }
  }, [validateUrl, validateShortcode, validateValidity]);

  const validateBulkRequests = useCallback(async (urlRequests) => {
    const validationResults = [];
    
    for (let i = 0; i < urlRequests.length; i++) {
      const result = await validateUrlRequest(urlRequests[i]);
      validationResults.push({
        index: i,
        ...result
      });
    }
    
    return validationResults;
  }, [validateUrlRequest]);

  const setFieldError = useCallback((field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, []);

  const clearFieldError = useCallback((field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateUrl,
    validateShortcode,
    validateValidity,
    validateUrlRequest,
    validateBulkRequests,
    setFieldError,
    clearFieldError,
    clearAllErrors
  };
};
