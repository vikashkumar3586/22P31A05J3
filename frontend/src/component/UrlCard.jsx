import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Divider,
  Stack
} from '@mui/material';
import {
  Link as LinkIcon,
  AccessTime,
  Mouse,
  Launch
} from '@mui/icons-material';
import { formatDistanceToNow } from '../utils/dateUtils';

const UrlCard = ({ urlData, onViewDetails, onRedirect }) => {
  const isExpired = new Date() > new Date(urlData.expiresAt);
  
  const handleRedirect = () => {
    if (!isExpired && onRedirect) {
      onRedirect(urlData.shortcode);
    }
  };

  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(urlData);
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 3, 
        opacity: isExpired ? 0.7 : 1,
        border: '2px solid',
        borderColor: isExpired ? 'error.light' : 'rgba(0,0,0,0.08)',
        borderRadius: 3,
        background: isExpired 
          ? 'linear-gradient(135deg, #fee 0%, #fef0f0 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          transform: 'translateY(-2px)',
          borderColor: isExpired ? 'error.main' : 'primary.light'
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Box flex={1} mr={3}>
            <Box display="flex" alignItems="center" mb={2}>
              <Box 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: isExpired ? 'error.main' : 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}
              >
                <LinkIcon sx={{ color: 'white', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                Short URL
              </Typography>
            </Box>
            <Paper
              sx={{ 
                p: 2,
                backgroundColor: isExpired ? 'rgba(255,0,0,0.05)' : 'rgba(25,118,210,0.05)',
                border: '1px solid',
                borderColor: isExpired ? 'error.light' : 'primary.light',
                borderRadius: 2
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: 'Monaco, Consolas, monospace',
                  fontWeight: 600,
                  color: isExpired ? 'error.main' : 'primary.main',
                  wordBreak: 'break-all',
                  fontSize: '1rem'
                }}
              >
                {`http://localhost:3000/${urlData.shortcode}`}
              </Typography>
            </Paper>
          </Box>
          
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={isExpired ? 'Expired' : 'Active'} 
              color={isExpired ? 'error' : 'success'}
              size="small"
              sx={{ 
                fontWeight: 600,
                '& .MuiChip-label': {
                  fontSize: '0.75rem'
                }
              }}
            />
            <Chip 
              icon={<Mouse sx={{ fontSize: 16 }} />}
              label={`${urlData.clicks} clicks`}
              size="small"
              variant="outlined"
              sx={{ 
                fontWeight: 500,
                backgroundColor: 'rgba(0,0,0,0.02)'
              }}
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 3, backgroundColor: 'rgba(0,0,0,0.08)' }} />

        <Box mb={3}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
            Original URL:
          </Typography>
          <Paper
            sx={{ 
              p: 2,
              backgroundColor: 'rgba(0,0,0,0.02)',
              border: '1px solid rgba(0,0,0,0.08)',
              borderRadius: 2
            }}
          >
            <Typography 
              variant="body2" 
              sx={{ 
                wordBreak: 'break-all',
                lineHeight: 1.6,
                color: 'text.primary'
              }}
            >
              {urlData.originalUrl}
            </Typography>
          </Paper>
        </Box>

        <Box display="flex" justify="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              <AccessTime sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
              Created: {formatDistanceToNow(new Date(urlData.createdAt))} ago
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block">
              <AccessTime sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
              Expires: {formatDistanceToNow(new Date(urlData.expiresAt))} 
              {isExpired ? ' (expired)' : ''}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            size="medium"
            startIcon={<Launch />}
            onClick={handleRedirect}
            disabled={isExpired}
            sx={{
              minWidth: 120,
              fontWeight: 600,
              background: isExpired 
                ? 'grey.400' 
                : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                background: isExpired 
                  ? 'grey.400' 
                  : 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              }
            }}
          >
            Visit
          </Button>
          <Button
            variant="outlined"
            size="medium"
            onClick={handleViewDetails}
            sx={{
              minWidth: 120,
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': {
                borderWidth: 2
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UrlCard;
