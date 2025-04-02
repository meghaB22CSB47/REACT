import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  LockOutlined,
  PersonOutline,
  HealthAndSafetyOutlined,
  Business as BusinessIcon
} from '@mui/icons-material';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    mspId: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      if (!formData.username || !formData.password || !formData.mspId) {
        throw new Error('Please fill in all fields');
      }

      // Special case for admin - for demo purposes
      if (formData.username === 'admin') {
        localStorage.setItem('jwt', 'demo-admin-token');
        localStorage.setItem('username', 'admin');
        localStorage.setItem('mspId', formData.mspId);
        setLoading(false); // Important: Need to set loading to false before navigating
        window.location.href = '/admin';
        return;
      }

      // Make API request
      const response = await fetch('http://localhost:8080/fabric/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      // Extract token and store in localStorage
      const token = await response.text();
      localStorage.setItem('jwt', token);
      localStorage.setItem('username', formData.username);
      localStorage.setItem('mspId', formData.mspId);

      // Navigate based on organization using window.location for immediate redirect
      if (formData.mspId === 'Org1MSP') {
        window.location.href = '/doctor';
      } else if (formData.mspId === 'Org2MSP') {
        window.location.href = '/patient';
      } else {
        setError('Unknown organization');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #2C3E50 30%, #3498DB 90%)',
      }}
    >
      {/* Left Side - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 4,
          textAlign: 'center',
        }}
      >
        <HealthAndSafetyOutlined sx={{ fontSize: 80, mb: 3 }} />
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          HealthLink
        </Typography>
        <Typography variant="h5" sx={{ mb: 4 }}>
          Secure blockchain-based EHR system
        </Typography>
        <Box sx={{ maxWidth: 500 }}>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
            Empowering patients with control over their health data while enabling
            secure collaboration between healthcare providers.
          </Typography>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center"
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.1)', 
              p: 2, 
              borderRadius: 2 
            }}
          >
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                100%
              </Typography>
              <Typography variant="body2">Secure</Typography>
            </Box>
            <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Private
              </Typography>
              <Typography variant="body2">Control</Typography>
            </Box>
            <Box sx={{ width: '1px', bgcolor: 'rgba(255,255,255,0.3)' }} />
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Trusted
              </Typography>
              <Typography variant="body2">Blockchain</Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          width: { xs: '100%', md: '500px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'white',
          p: { xs: 3, md: 8 },
          position: 'relative',
        }}
      >
        <Box sx={{ mb: 5, display: { xs: 'block', md: 'none' }, textAlign: 'center' }}>
          <HealthAndSafetyOutlined sx={{ fontSize: 40, color: '#3498DB', mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            HealthLink
          </Typography>
        </Box>

        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Sign In
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter your credentials to access your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutline color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(0, 0, 0, 0.23)',
                  }
                }
              }}
            />

            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <LockOutlined color="primary" />
                  </InputAdornment>
                }
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="msp-id-label">Organization</InputLabel>
              <Select
                labelId="msp-id-label"
                id="mspId"
                name="mspId"
                value={formData.mspId}
                label="Organization"
                onChange={handleChange}
                startAdornment={
                  <InputAdornment position="start">
                    <BusinessIcon color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="Org1MSP">Org1MSP (Doctor)</MenuItem>
                <MenuItem value="Org2MSP">Org2MSP (Patient)</MenuItem>
              </Select>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                mt: 2,
                bgcolor: '#3498DB',
                '&:hover': { bgcolor: '#2980B9' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Stack>
        </Box>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            For demo: Use "admin" as username for Admin access
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
