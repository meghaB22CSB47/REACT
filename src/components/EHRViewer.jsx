import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton
} from '@mui/material';
import {
  Logout as LogoutIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  LocalHospital as LocalHospitalIcon
} from '@mui/icons-material';
import { logout } from '../utils/auth';

const EHRViewer = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [ehrData, setEhrData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Define EHR fields with user-friendly labels
  const ehrFields = [
    { id: 'diagnosis', label: 'Diagnosis' },
    { id: 'treatment', label: 'Treatment Plan' },
    { id: 'medications', label: 'Medications' },
    { id: 'doctorNotes', label: 'Doctor Notes' },
    { id: 'patientHistory', label: 'Patient History' },
    { id: 'allergies', label: 'Allergies' },
    { id: 'labResults', label: 'Laboratory Results' },
    { id: 'imagingReports', label: 'Imaging Reports' },
    { id: 'vitalSigns', label: 'Vital Signs' },
    { id: 'familyHistory', label: 'Family History' },
    { id: 'lifestyleFactors', label: 'Lifestyle Factors' },
    { id: 'immunizations', label: 'Immunizations' },
    { id: 'carePlan', label: 'Care Plan' },
    { id: 'followUpInstructions', label: 'Follow-up Instructions' }
  ];

  useEffect(() => {
    fetchEHR();
  }, [patientId]);

  const fetchEHR = async () => {
    setLoading(true);
    try {
      const storedPatientId = patientId || localStorage.getItem('patientId');
      
      const response = await fetch(`http://localhost:8080/fabric/doctor/view-ehr?patientId=${storedPatientId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch EHR data');
      
      const data = await response.json();
      setEhrData(data);
    } catch (error) {
      console.error('Error fetching EHR:', error);
      setError('Failed to load EHR data. Please try again.');
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

  const handleGoBack = () => {
    window.location.href = '/doctor';
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (field, value) => {
    setEhrData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const storedPatientId = patientId || localStorage.getItem('patientId');
      
      const response = await fetch(`http://localhost:8080/fabric/doctor/update-ehr?patientId=${storedPatientId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt')}`
        },
        body: JSON.stringify({
          patientId: storedPatientId,
          ...ehrData
        })
      });

      if (!response.ok) throw new Error('Failed to update EHR');
      
      setSuccess('EHR updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to update EHR data. Please try again.');
    } finally {
      setSaving(false);
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
          <LocalHospitalIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Patient EHR - {patientId || localStorage.getItem('patientId')}
          </Typography>
          <Button 
            color="inherit" 
            onClick={handleGoBack}
            startIcon={<ArrowBackIcon />}
            sx={{ mr: 2 }}
          >
            Back
          </Button>
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
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5" component="h2">
                Electronic Health Record
              </Typography>
              {!isEditing ? (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                >
                  Edit Record
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  Save Changes
                </Button>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={3}>
                {ehrFields.map((field) => (
                  <Grid item xs={12} md={6} key={field.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={600} color="text.secondary" gutterBottom>
                          {field.label}
                        </Typography>
                        {isEditing ? (
                          <TextField
                            fullWidth
                            multiline
                            rows={2}
                            value={ehrData[field.id] || ''}
                            onChange={(e) => handleChange(field.id, e.target.value)}
                            variant="outlined"
                            sx={{ mt: 1 }}
                          />
                        ) : (
                          <Typography variant="body1" sx={{ mt: 1, minHeight: '50px' }}>
                            {ehrData[field.id] || 'No data available'}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>
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

export default EHRViewer;
