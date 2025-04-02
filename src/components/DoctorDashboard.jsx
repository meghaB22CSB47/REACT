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
  InputAdornment
} from '@mui/material';
import {
  Logout as LogoutIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  LocalHospital as DoctorIcon,
  Person as PatientIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { logout } from '../utils/auth';

const DoctorDashboard = () => {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <DoctorIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Doctor Dashboard
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
        <Grid container spacing={3}>
          {/* Add Patient Request */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Add Patient Request
                </Typography>
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
                          <PatientIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddRequest}
                    disabled={updating || !patientId.trim()}
                    startIcon={updating ? <CircularProgress size={20} /> : <AddIcon />}
                    sx={{ px: 3, py: 1.5, whiteSpace: 'nowrap' }}
                  >
                    Add Request
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Patient List */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Patient Records
                  </Typography>
                  <TextField
                    placeholder="Search patients..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearch}
                    sx={{ width: 250 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                  </Box>
                ) : filteredPatients.length === 0 ? (
                  <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                    <Typography variant="body1" color="text.secondary">
                      No patients found. Add a patient request to get started.
                    </Typography>
                  </Paper>
                ) : (
                  <Grid container spacing={2}>
                    {filteredPatients.map((patient) => (
                      <Grid item xs={12} key={patient.pid}>
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
                              <PatientIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight={500}>
                                Patient ID: {patient.pid}
                              </Typography>
                              <Chip 
                                size="small" 
                                label="Active" 
                                color="success" 
                                variant="outlined"
                                sx={{ mt: 0.5 }}
                              />
                            </Box>
                          </Box>
                          
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => handleViewEHR(patient)}
                            >
                              View EHR
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => handleOpenUpdateDialog(patient)}
                            >
                              Update
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
      >
        <DialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              Update EHR for Patient {currentPatient?.pid}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Enter additional information to append to the patient's electronic health record:
          </Typography>
          <TextField
            autoFocus
            multiline
            rows={8}
            fullWidth
            variant="outlined"
            value={ehrText}
            onChange={(e) => setEhrText(e.target.value)}
            placeholder="Enter notes, diagnosis, treatment plans, or other relevant medical information..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button 
            onClick={handleUpdateEHR} 
            variant="contained" 
            color="primary"
            disabled={updating || !ehrText.trim()}
            startIcon={updating ? <CircularProgress size={20} /> : <EditIcon />}
          >
            Update EHR
          </Button>
        </DialogActions>
      </Dialog>
      
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

export default DoctorDashboard;