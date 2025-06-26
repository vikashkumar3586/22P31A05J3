import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  Add,
  Remove,
  Send
} from '@mui/icons-material';
import { useValidation } from '../hook/useValidation';

const UrlInputForm = ({ onSubmit, loading, maxUrls = 5 }) => {
  const [urlInputs, setUrlInputs] = useState([
    { originalUrl: '', customShortcode: '', validityMinutes: 30 }
  ]);
  const [localErrors, setLocalErrors] = useState({});
  const { validateBulkRequests } = useValidation();

  const addUrlInput = () => {
    if (urlInputs.length < maxUrls) {
      setUrlInputs([
        ...urlInputs,
        { originalUrl: '', customShortcode: '', validityMinutes: 30 }
      ]);
    }
  };

  const removeUrlInput = (index) => {
    if (urlInputs.length > 1) {
      const newInputs = urlInputs.filter((_, i) => i !== index);
      const newErrors = { ...localErrors };
      Object.keys(newErrors).forEach(key => {
        if (key.startsWith(`${index}_`)) {
          delete newErrors[key];
        }
      });
      setLocalErrors(newErrors);
    }
  };

  const updateUrlInput = (index, field, value) => {
    const newInputs = [...urlInputs];
    newInputs[index] = { ...newInputs[index], [field]: value };
    setUrlInputs(newInputs);

    const errorKey = `${index}_${field}`;
    if (localErrors[errorKey]) {
      const newErrors = { ...localErrors };
      delete newErrors[errorKey];
      setLocalErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationResults = await validateBulkRequests(urlInputs);
    const newErrors = {};
    
    validationResults.forEach(result => {
      if (!result.isValid) {
        Object.keys(result.errors).forEach(field => {
          newErrors[`${result.index}_${field}`] = result.errors[field];
        });
      }
    });

    setLocalErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onSubmit(urlInputs);
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create Short URLs
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        You can create up to {maxUrls} short URLs at once. Default validity is 30 minutes.
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        {urlInputs.map((input, index) => (
          <Paper 
            key={index}
            variant="outlined" 
            sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                URL #{index + 1}
              </Typography>
              {urlInputs.length > 1 && (
                <IconButton 
                  onClick={() => removeUrlInput(index)}
                  color="error"
                  size="small"
                >
                  <Remove />
                </IconButton>
              )}
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Original URL"
                  placeholder="https://example.com"
                  value={input.originalUrl}
                  onChange={(e) => updateUrlInput(index, 'originalUrl', e.target.value)}
                  error={!!localErrors[`${index}_originalUrl`]}
                  helperText={localErrors[`${index}_originalUrl`]}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Custom Shortcode (optional)"
                  placeholder="mylink"
                  value={input.customShortcode}
                  onChange={(e) => updateUrlInput(index, 'customShortcode', e.target.value)}
                  error={!!localErrors[`${index}_customShortcode`]}
                  helperText={localErrors[`${index}_customShortcode`] || 'Leave empty for auto-generation'}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Validity (minutes)"
                  type="number"
                  value={input.validityMinutes}
                  onChange={(e) => updateUrlInput(index, 'validityMinutes', parseInt(e.target.value) || 30)}
                  error={!!localErrors[`${index}_validityMinutes`]}
                  helperText={localErrors[`${index}_validityMinutes`] || 'Default: 30 minutes'}
                  inputProps={{ min: 1, max: 10080 }}
                />
              </Grid>
            </Grid>
          </Paper>
        ))}

        <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addUrlInput}
            disabled={urlInputs.length >= maxUrls}
          >
            Add URL ({urlInputs.length}/{maxUrls})
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<Send />}
            disabled={loading}
            size="large"
          >
            {loading ? 'Creating...' : `Create ${urlInputs.length} Short URL${urlInputs.length > 1 ? 's' : ''}`}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UrlInputForm;
