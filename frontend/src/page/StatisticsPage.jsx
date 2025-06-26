import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  Analytics,
  Launch,
  Visibility,
  Schedule,
  Mouse
} from '@mui/icons-material';
import { useUrlShortener } from '../hook/useUrlShortener';
import { formatDistanceToNow, formatDateTime } from '../utils/dateUtils';
import { loggingApi } from '../api/loggingApi';

const StatisticsPage = () => {
  const {
    urls,
    loading,
    error,
    loadAllUrls,
    redirectToOriginalUrl,
    clearError
  } = useUrlShortener();
  
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      await loggingApi.logInfo('page', 'Statistics page visited');
      loadAllUrls();
    };
    loadData();
  }, [loadAllUrls]);

  const handleViewDetails = (urlData) => {
    setSelectedUrl(urlData);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedUrl(null);
  };

  const handleRedirect = async (shortcode) => {
    try {
      await redirectToOriginalUrl(shortcode);
    } catch (error) {
      // Error is already logged in the hook
    }
  };

  const handleCloseError = () => {
    clearError();
  };

  const getStatusChip = (urlData) => {
    const isExpired = new Date() > new Date(urlData.expiresAt);
    return (
      <Chip 
        label={isExpired ? 'Expired' : 'Active'} 
        color={isExpired ? 'error' : 'success'}
        size="small"
      />
    );
  };

  const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
  const activeUrls = urls.filter(url => new Date() <= new Date(url.expiresAt)).length;
  const expiredUrls = urls.length - activeUrls;

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading statistics...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom>
          <Analytics sx={{ mr: 2, fontSize: 'inherit' }} />
          URL Statistics
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Analytics and insights for your shortened URLs
        </Typography>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          onClose={handleCloseError}
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {urls.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {activeUrls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="error.main">
                {expiredUrls}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Expired URLs
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {totalClicks}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Clicks
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* URLs Table */}
      <Paper elevation={2}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            All URLs
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </Box>

        {urls.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No URLs found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first short URL to see statistics here
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Short URL</TableCell>
                  <TableCell>Original URL</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">
                    <Mouse sx={{ mr: 1 }} />
                    Clicks
                  </TableCell>
                  <TableCell>
                    <Schedule sx={{ mr: 1 }} />
                    Created
                  </TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {urls.map((url) => (
                  <TableRow key={url.shortcode} hover>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontFamily: 'monospace',
                          color: 'primary.main'
                        }}
                      >
                        /{url.shortcode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          maxWidth: 300,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                        title={url.originalUrl}
                      >
                        {url.originalUrl}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {getStatusChip(url)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip 
                        label={url.clicks}
                        variant="outlined"
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDistanceToNow(new Date(url.createdAt))} ago
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small"
                          startIcon={<Launch />}
                          onClick={() => handleRedirect(url.shortcode)}
                          disabled={new Date() > new Date(url.expiresAt)}
                        >
                          Visit
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<Visibility />}
                          onClick={() => handleViewDetails(url)}
                        >
                          Details
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Details Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          URL Details
        </DialogTitle>
        <DialogContent>
          {selectedUrl && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Short URL:
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      backgroundColor: 'grey.100',
                      p: 1,
                      borderRadius: 1
                    }}
                  >
                    http://localhost:3000/{selectedUrl.shortcode}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Status:
                  </Typography>
                  {getStatusChip(selectedUrl)}
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Original URL:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    wordBreak: 'break-all',
                    backgroundColor: 'grey.100',
                    p: 1,
                    borderRadius: 1
                  }}
                >
                  {selectedUrl.originalUrl}
                </Typography>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Created:
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(selectedUrl.createdAt)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Expires:
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTime(selectedUrl.expiresAt)}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Click Statistics:
                </Typography>
                <Typography variant="h6" color="primary">
                  {selectedUrl.clicks} total clicks
                </Typography>
              </Box>

              {selectedUrl.clickData && selectedUrl.clickData.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Recent Clicks:
                  </Typography>
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Timestamp</TableCell>
                          <TableCell>Source</TableCell>
                          <TableCell>Location</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedUrl.clickData.slice(-10).reverse().map((click, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              {formatDateTime(click.timestamp)}
                            </TableCell>
                            <TableCell>{click.source}</TableCell>
                            <TableCell>{click.location}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          {selectedUrl && new Date() <= new Date(selectedUrl.expiresAt) && (
            <Button 
              variant="contained"
              startIcon={<Launch />}
              onClick={() => {
                handleRedirect(selectedUrl.shortcode);
                handleCloseDialog();
              }}
            >
              Visit URL
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StatisticsPage;
