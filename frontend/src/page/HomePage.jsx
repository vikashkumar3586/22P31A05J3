import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Grid,
  Divider,
  Snackbar,
  Button,
  Chip
} from '@mui/material';
import UrlInputForm from '../component/UrlInputForm';
import UrlCard from '../component/UrlCard';
import { useUrlShortener } from '../hook/useUrlShortener';
import { loggingApi } from '../api/loggingApi';

const HomePage = () => {
  const {
    createBulkShortUrls,
    loading,
    error,
    bulkResults,
    clearError,
    redirectToOriginalUrl
  } = useUrlShortener();
  
  const [recentUrls, setRecentUrls] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const logPageVisit = async () => {
      // Non-blocking logging
      loggingApi.logInfo('page', 'Home page visited').catch(() => {});
    };
    logPageVisit();
  }, []);

  useEffect(() => {
    console.log('Bulk results updated:', bulkResults); // Debug log
    if (bulkResults.length > 0) {
      setRecentUrls(bulkResults);
      setShowSuccess(true);
    }
  }, [bulkResults]);

  const handleCreateUrls = async (urlRequests) => {
    try {
      console.log('Creating URLs:', urlRequests); // Debug log
      // Non-blocking logging
      loggingApi.logInfo('page', `Creating ${urlRequests.length} URLs from home page`).catch(() => {});
      const result = await createBulkShortUrls(urlRequests);
      console.log('Result:', result); // Debug log
      
      if (result.errors.length > 0) {
        // Non-blocking logging
        loggingApi.logWarning('page', `Some URLs failed to create: ${result.errors.length}`).catch(() => {});
      }
    } catch (error) {
      console.error('Error creating URLs:', error); // Debug log
      // Non-blocking logging
      loggingApi.logError('page', `Failed to create URLs: ${error.message}`).catch(() => {});
    }
  };

  const handleRedirect = async (shortcode) => {
    try {
      await redirectToOriginalUrl(shortcode);
    } catch (error) {
      // Error is already logged in the hook
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  const handleCloseError = () => {
    clearError();
  };

  return (
    <Box sx={{ width: '100%', minHeight: '100vh', p: 2 }}>
      <Box textAlign="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Create short, manageable links for your long URLs
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" onClose={handleCloseError} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <UrlInputForm
            onSubmit={handleCreateUrls}
            loading={loading}
            maxUrls={5}
          />
        </Grid>

        <Grid item xs={12} lg={6}>
          {recentUrls.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Your Short URLs
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
                {recentUrls.map((url, index) => (
                  <Paper key={`${url.shortcode}-${index}`} variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Short URL:
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontFamily: 'monospace',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        mb: 1,
                        wordBreak: 'break-all'
                      }}
                    >
                      http://localhost:5176/{url.shortcode}
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary">
                      Original URL:
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ mb: 2, wordBreak: 'break-all' }}
                    >
                      {url.originalUrl}
                    </Typography>
                    
                    <Box display="flex" gap={1} alignItems="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleRedirect(url.shortcode)}
                      >
                        Visit
                      </Button>
                      <Chip 
                        label={`${url.clicks || 0} clicks`} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Box>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}

          {recentUrls.length === 0 && (
            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your shortened URLs will appear here
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create your first short URL using the form
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success">
          {recentUrls.length} short URL{recentUrls.length > 1 ? 's' : ''} created successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HomePage;
