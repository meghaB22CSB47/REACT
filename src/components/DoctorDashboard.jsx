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
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Chip,
  Avatar,
  Paper,
  CircularProgress,
  Alert,
  Snackbar,
  InputAdornment,
  useTheme,
  alpha
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  LocalHospital as DoctorIcon,
  Person as PatientIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { logout } from '../utils/auth';

const DoctorDashboard = () => {
  const theme = useTheme();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [patientId, setPatientId] = useState('');
  const [currentPatient, setCurrentPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [ehrText, setEhrText] = useState('');
  const navigate = useNavigate();

  // Fetch patients on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  // Filter patients based on search term
  useEffect(() => {
    if (patients.length > 0) {
      setFilteredPatients(
        patients.filter(patient => 
          patient.pid.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, patients]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/fabric/doctor/patients', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch patients');
      const data = await response.json();
      setPatients(data);
      setFilteredPatients(data);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load patient data. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddRequest = async () => {
    if (!patientId.trim()) {
      setError('Please enter a valid Patient ID');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`http://localhost:8080/fabric/doctor/add-request?pid=${patientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error('Failed to add request');
      setSuccess(`Request for patient ${patientId} added successfully!`);
      setPatientId('');
      fetchPatients();
    } catch (error) {
      console.error('Error:', error);
      setError(`Failed to add request for patient ${patientId}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleViewEHR = (patient) => {
    localStorage.setItem('patientId', patient.pid);
    navigate(`/ehr/${patient.pid}`);
  };

  const handleOpenUpdateDialog = (patient) => {
    setCurrentPatient(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEhrText('');
    setCurrentPatient(null);
  };

  const handleUpdateEHR = async () => {
    if (!ehrText.trim()) {
      setError('Please enter text to update the EHR');
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`http://localhost:8080/fabric/doctor/update-pdf?pid=${currentPatient.pid}&newText=${encodeURIComponent(ehrText)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error('Failed to update EHR');
      setSuccess(`EHR for patient ${currentPatient.pid} updated successfully!`);
      handleCloseDialog();
    } catch (error) {
      console.error('Error:', error);
      setError(`Failed to update EHR for patient ${currentPatient?.pid}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleCloseAlert = () => {
    setError('');
    setSuccess('');
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: alpha(theme.palette.primary.light, 0.05)
    }}>
      <AppBar 
        position="fixed" 
        color="primary" 
        elevation={0}
        sx={{ 
          borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          backdropFilter: 'blur(8px)',
          backgroundColor: '#092039'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <DoctorIcon sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h5" component="div" fontWeight="600">
              HealthLink
            </Typography>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 500,
                display: { xs: 'none', md: 'block' } 
              }}
            >
              Doctor Dashboard
            </Typography>
          </Box>
          
          <Button 
            color="inherit" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ 
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.15)
              }
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 12, mb: 6, flex: 1 }}>
        <Box sx={{ mb: 4 }}>
            <Typography variant="h4" fontWeight="600" gutterBottom align="center" >
              Welcome, Doctor
            </Typography>
            <Typography 
              variant="body1" align="center"
              sx={{ color: 'black' }}
            >
              Manage your patients and electronic health records from this dashboard.
            </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {/* Add Patient Request */}
          <Grid item xs={12}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  py: 1.5,
                  px: 3
                }}
              >
                <Typography variant="h6" fontWeight="500">
                  Add Patient Request
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField 
                    fullWidth
                    label="Patient ID"
                    variant="outlined"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Enter Patient ID"
                    disabled={updating}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PatientIcon color="primary" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddRequest}
                    disabled={updating || !patientId.trim()}
                    startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <AddIcon />}
                    sx={{ 
                      px: 3, 
                      py: 1.5, 
                      whiteSpace: 'nowrap',
                      borderRadius: 2,
                      boxShadow: 2,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    Add Request
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Patient List */}
          <Grid item xs={12}>
            <Card 
              elevation={0}
              sx={{ 
                borderRadius: 3, 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                overflow: 'hidden'
              }}
            >
              <Box 
                sx={{ 
                  bgcolor: 'primary.main', 
                  color: 'primary.contrastText',
                  py: 1.5,
                  px: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="h6" fontWeight="500">
                  Patient Records
                </Typography>
                <TextField
                  placeholder="Search patients..."
                  variant="outlined"
                  size="small"
                  value={searchTerm}
                  onChange={handleSearch}
                  sx={{ 
                    width: 250, 
                    bgcolor: alpha(theme.palette.common.white, 0.1),
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '& fieldset': {
                        borderColor: 'transparent'
                      },
                      '&:hover fieldset': {
                        borderColor: 'transparent'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: alpha(theme.palette.common.white, 0.3)
                      }
                    },
                    '& .MuiInputBase-input': {
                      color: theme.palette.common.white
                    },
                    '& .MuiInputAdornment-root .MuiSvgIcon-root': {
                      color: theme.palette.common.white
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              
              <CardContent sx={{ p: 3 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                    <CircularProgress color="primary" />
                  </Box>
                ) : filteredPatients.length === 0 ? (
                  <Paper 
                    sx={{ 
                      p: 5, 
                      textAlign: 'center', 
                      bgcolor: alpha(theme.palette.primary.light, 0.05),
                      border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
                      borderRadius: 3
                    }}
                  >
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                      No patients found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add a patient request to get started
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {filteredPatients.map((patient) => (
                      <Grid item xs={12} key={patient.pid}>
                        <Paper 
                          elevation={0}
                          sx={{ 
                            p: 3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
                            transition: 'all 0.25s ease',
                            '&:hover': {
                              boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
                              transform: 'translateY(-3px)',
                              borderColor: 'transparent'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar 
                              sx={{ 
                                bgcolor: alpha(theme.palette.primary.main, 0.1), 
                                color: theme.palette.primary.main,
                                width: 50, 
                                height: 50,
                                mr: 2
                              }}
                            >
                              <PatientIcon fontSize="large" />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" fontWeight={500}>
                                Patient {patient.pid}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                <Chip 
                                  size="small" 
                                  label="Active" 
                                  color="success" 
                                  sx={{ 
                                    borderRadius: 1,
                                    fontWeight: 500
                                  }}
                                />
                                <Typography 
                                  variant="body2" 
                                  color="text.secondary"
                                  sx={{ ml: 2 }}
                                >
                                  ID: {patient.pid}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="medium"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewEHR(patient)}
                              sx={{ 
                                borderRadius: 2,
                                px: 2,
                                '&:hover': {
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }
                              }}
                            >
                              View EHR
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              size="medium"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenUpdateDialog(patient)}
                              sx={{ 
                                borderRadius: 2,
                                px: 2,
                                boxShadow: 2,
                                '&:hover': {
                                  boxShadow: 4
                                }
                              }}
                            >
                              Update EHR
                            </Button>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      
      {/* Update EHR Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          elevation: 24,
          sx: {
            borderRadius: 3,
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" fontWeight={500}>
              Update EHR for Patient {currentPatient?.pid}
            </Typography>
            <IconButton 
              onClick={handleCloseDialog} 
              size="small"
              sx={{ color: 'common.white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Box sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Enter additional information to append to the patient's electronic health record:
            </Typography>
            <TextField
              autoFocus
              multiline
              rows={10}
              fullWidth
              variant="outlined"
              value={ehrText}
              onChange={(e) => setEhrText(e.target.value)}
              placeholder="Enter notes, diagnosis, treatment plans, or other relevant medical information..."
              sx={{ 
                mt: 1,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Button 
            onClick={handleCloseDialog} 
            color="inherit"
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateEHR} 
            variant="contained" 
            color="primary"
            disabled={updating || !ehrText.trim()}
            startIcon={updating ? <CircularProgress size={20} color="inherit" /> : <EditIcon />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4
              }
            }}
          >
            Update EHR
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: '#043B89', 
          borderTop: '1px solid', 
          borderColor: 'divider',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DoctorIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
            <Typography variant="body2" color="white" fontWeight={500}>
              HealthLink
            </Typography>
          </Box>
          <Typography variant="body2" color="white" align="center" sx={{ mt: 1 }}>
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
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: 4
          }}
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
          sx={{ 
            width: '100%',
            borderRadius: 2,
            boxShadow: 4
          }}
        >
          {success}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DoctorDashboard;

