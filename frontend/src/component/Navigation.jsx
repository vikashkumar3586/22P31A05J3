import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import {
  Link as LinkIcon,
  Analytics,
  Home
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ px: 2 }}>
        <Box display="flex" alignItems="center" flexGrow={1}>
          <LinkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            URL Shortener
            </Typography>
          </Box>
          
          <Box display="flex" gap={2}>
            <Button
              color="inherit"
              startIcon={<Home />}
              onClick={() => navigate('/')}
              variant={isActive('/') ? 'outlined' : 'text'}
              sx={{ 
                color: 'white',
                borderColor: isActive('/') ? 'white' : 'transparent',
                fontWeight: 500
              }}
            >
              Home
            </Button>
            
            <Button
              color="inherit"
              startIcon={<Analytics />}
              onClick={() => navigate('/statistics')}
              variant={isActive('/statistics') ? 'outlined' : 'text'}
              sx={{ 
                color: 'white',
                borderColor: isActive('/statistics') ? 'white' : 'transparent',
                fontWeight: 500
              }}
            >
              Statistics
            </Button>
          </Box>
        </Toolbar>
    </AppBar>
  );
};

export default Navigation;
