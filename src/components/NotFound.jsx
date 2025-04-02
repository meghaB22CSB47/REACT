import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#F8FAFC',
        textAlign: 'center',
        padding: 3,
      }}
    >
      <ErrorOutlineIcon sx={{ fontSize: 100, color: '#E74C3C', mb: 3 }} />
      <Typography variant="h2" sx={{ mb: 2, fontWeight: 700, color: '#2C3E50' }}>
        404
      </Typography>
      <Typography variant="h4" sx={{ mb: 3, color: '#2C3E50' }}>
        Page Not Found
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, maxWidth: 500, color: '#7F8C8D' }}>
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        size="large"
        onClick={() => navigate('/')}
        sx={{ 
          borderRadius: 2,
          px: 4,
          py: 1.5,
          fontSize: '1rem',
        }}
      >
        Go to Homepage
      </Button>
    </Box>
  );
};

export default NotFound;
