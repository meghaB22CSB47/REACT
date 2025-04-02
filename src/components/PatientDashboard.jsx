import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Divider,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Chip
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  History as HistoryIcon,
  PersonOutline as DoctorIcon,
  Refresh as RefreshIcon,
  AccessTime as PendingIcon,
  CheckCircleOutline as AcceptedIcon
} from '@mui/icons-material';
import { logout } from '../utils/auth';

const PatientDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [acceptedDoctors, setAcceptedDoctors] = useState([]);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch accepted doctors
      const acceptedResponse = await fetch('http://localhost:8080/fabric/patient/accepted', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!acceptedResponse.ok) throw new Error("Failed to fetch accepted doctors");
      const acceptedData = await acceptedResponse.json();
      setAcceptedDoctors(acceptedData);

      // Fetch pending requests
      const pendingResponse = await fetch('http://localhost:8080/fabric/patient/request', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!pendingResponse.ok) throw new Error("Failed to fetch pending requests");
      const pendingData = await pendingResponse.json();
      setPendingDoctors(pendingData);
      
    } catch (error) {
      console.error(error);
      setError('Failed to load doctor data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDoctorData();
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('mspId');
    localStorage.removeItem('patientId');
    localStorage.removeItem('doctorId');
    localStorage.removeItem('historyData');
    
    // Force immediate navigation to login
    window.location.href = '/login';
  };

  const handleAction = async (action, doctorId) => {
    setActionLoading(doctorId);
    try {
      const response = await fetch(`http://localhost:8080/fabric/patient/request/${doctorId}?status=${action}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error(`Failed to ${action.toLowerCase()} doctor`);
      
      setSuccess(`Doctor ${action === 'Accepted' ? 'accepted' : action === 'Rejected' ? 'rejected' : 'revoked'} successfully!`);
      fetchDoctorData();
    } catch (error) {
      console.error(error);
      setError(`Failed to ${action.toLowerCase()} doctor. Please try again.`);
    } finally {
      setActionLoading(null);
    }
  };

  const viewHistory = (doctorId) => {
    navigate(`/history/${doctorId}`);
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  // Render doctor list items
  const renderDoctorList = (doctors, isPending = false) => {
    if (doctors.length === 0) {
      return (
        <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
          <Typography variant="body1" color="text.secondary">
            No {isPending ? 'pending' : 'accepted'} doctors found.
          </Typography>
        </Paper>
      );
    }

    return doctors.map((doctorId) => (
      <Grid item xs={12} key={doctorId}>
        <Paper 
          elevation={2}
          sx={{ 
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 2,
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: 3,
              transform: 'translateY(-2px)',
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <DoctorIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={500}>
                Doctor ID: {doctorId}
              </Typography>
              <Chip 
                size="small" 
                label={isPending ? "Pending" : "Accepted"} 
                color={isPending ? "warning" : "success"} 
                icon={isPending ? <PendingIcon /> : <AcceptedIcon />}
                variant="outlined"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isPending ? (
              <>
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={actionLoading === doctorId ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                  onClick={() => handleAction('Accepted', doctorId)}
                  disabled={!!actionLoading}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={actionLoading === doctorId ? <CircularProgress size={20} color="inherit" /> : <CloseIcon />}
                  onClick={() => handleAction('Rejected', doctorId)}
                  disabled={!!actionLoading}
                >
                  Reject
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<HistoryIcon />}
                  onClick={() => viewHistory(doctorId)}
                >
                  View History
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={actionLoading === doctorId ? <CircularProgress size={20} color="inherit" /> : <CloseIcon />}
                  onClick={() => handleAction('Revoke', doctorId)}
                  disabled={!!actionLoading}
                >
                  Revoke
                </Button>
              </>
            )}
          </Box>
        </Paper>
      </Grid>
    ));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <PersonIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient Dashboard
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 10, mb: 4, flex: 1 }}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Doctor Access Management
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                startIcon={refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                onClick={handleRefresh}
                disabled={refreshing}
              >
                Refresh
              </Button>
            </Box>
            <Divider />
            
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{ mt: 2 }}
            >
              <Tab 
                label="Accepted Doctors" 
                icon={<AcceptedIcon />} 
                iconPosition="start"
              />
              <Tab 
                label="Pending Requests" 
                icon={<PendingIcon />} 
                iconPosition="start"
              />
            </Tabs>
          </CardContent>
        </Card>
        
        {loading && !refreshing ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            {tabValue === 0 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Accepted Doctors
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    {renderDoctorList(acceptedDoctors)}
                  </Grid>
                </CardContent>
              </Card>
            )}
            
            {tabValue === 1 && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Pending Requests
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  <Grid container spacing={2}>
                    {renderDoctorList(pendingDoctors, true)}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Box>
        )}
      </Container>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          bgcolor: 'background.paper', 
          borderTop: '1px solid', 
          borderColor: 'divider',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            &copy; 2025 HealthLink. All Rights Reserved.
          </Typography>
        </Container>
      </Box>
      
      {/* Alerts */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity="error" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseAlert} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PatientDashboard;
