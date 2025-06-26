import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
  Paper
} from '@mui/material';
import { Home, Launch } from '@mui/icons-material';
import { useUrlShortener } from '../hook/useUrlShortener';
import { loggingApi } from '../api/loggingApi';

const RedirectPage = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const { redirectToOriginalUrl } = useUrlShortener();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState(null);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        setLoading(true);
        await loggingApi.logInfo('page', `Redirect page accessed for shortcode: ${shortcode}`);
        
        // Instead of directly redirecting, let's get the URL first
        const urlData = await redirectToOriginalUrl(shortcode);
        setRedirectUrl(urlData.originalUrl);
        
        // Auto-redirect after a short delay
        setTimeout(() => {
          window.location.href = urlData.originalUrl;
        }, 2000);
        
      } catch (error) {
        await loggingApi.logError('page', `Redirect failed for shortcode ${shortcode}: ${error.message}`);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (shortcode) {
      handleRedirect();
    } else {
      setError('No shortcode provided');
      setLoading(false);
    }
  }, [shortcode, redirectToOriginalUrl]);

  const handleManualRedirect = () => {
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {loading && (
          <Box>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h5" gutterBottom>
              Redirecting...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Processing shortcode: <strong>{shortcode}</strong>
            </Typography>
          </Box>
        )}

        {error && (
          <Box>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Typography variant="h5" gutterBottom>
              Redirect Failed
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              The short URL "/{shortcode}" could not be found or has expired.
            </Typography>
            <Button
              variant="contained"
              startIcon={<Home />}
              onClick={handleGoHome}
              size="large"
            >
              Go to Home
            </Button>
          </Box>
        )}

        {redirectUrl && !error && (
          <Box>
            <Typography variant="h5" gutterBottom color="success.main">
              Redirect Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              You will be redirected to:
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                wordBreak: 'break-all',
                backgroundColor: 'grey.100',
                p: 2,
                borderRadius: 1,
                mb: 3,
                fontFamily: 'monospace'
              }}
            >
              {redirectUrl}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              If you're not redirected automatically, click the button below:
            </Typography>
            <Box display="flex" gap={2} justifyContent="center">
              <Button
                variant="contained"
                startIcon={<Launch />}
                onClick={handleManualRedirect}
                size="large"
              >
                Go to URL
              </Button>
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={handleGoHome}
              >
                Back to Home
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default RedirectPage;
