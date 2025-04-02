import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#F8FAFC',
      }}
    >
      <CircularProgress size={60} sx={{ color: '#3498DB' }} />
      <Typography 
        variant="h5" 
        sx={{ 
          mt: 3, 
          fontWeight: 500,
          color: '#2C3E50'
        }}
      >
        Loading HealthLink...
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
