import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  AppBar,
  Toolbar,
  Container,
  CircularProgress,
  Alert,
  Snackbar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  InputAdornment
} from '@mui/material';
import {
  Upload as UploadIcon,
  Logout as LogoutIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Key as KeyIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    file: null
  });
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [adminOrg, setAdminOrg] = useState('');
  const navigate = useNavigate();

  // Simulate fetching registered users and determine admin's organization
  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    setRegisteredUsers(savedUsers);
    
    // Get admin's organization from localStorage
    const orgId = localStorage.getItem('mspId');
    setAdminOrg(orgId);
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files?.length) {
      setFormData({ ...formData, file: e.target.files[0] });
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Validate form data
      if (!formData.username || !formData.password) {
        throw new Error('Please fill in all required fields');
      }
      
      // Only require file for patient registration (Org2MSP)
      if (adminOrg === 'Org2MSP' && !formData.file && !fileName) {
        throw new Error('Please upload a JSON file for patient record');
      }

      // Create FormData object for the file upload
      const requestFormData = new FormData();
      requestFormData.append("username", formData.username);
      requestFormData.append("password", formData.password);
      
      // Only append file for patient organization
      if (adminOrg === 'Org2MSP' && formData.file) {
        requestFormData.append("file", formData.file);
      }

      // Ensure JWT is sent as a header
      const jwt = localStorage.getItem('jwt');
      console.log(jwt);
      if (!jwt || jwt.split('.').length !== 3) {
        throw new Error('Invalid or missing JWT token. Please log in again.');
      }

      // Make the actual API request to register user
      const response = await fetch("http://localhost:8080/fabric/register", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${jwt}`,
        },
        body: requestFormData,
      });

      if (!response.ok) {
        throw new Error("Registration failed. Server returned an error.");
      }

      // Handle successful response
      const responseData = await response.text();
      console.log("Registration successful:", responseData);
      
      // Save to local storage for UI demonstration
      const newUser = {
        id: Date.now(),
        username: formData.username,
        mspId: adminOrg, // Use admin's organization
        createdAt: new Date().toISOString(),
        fileAttached: adminOrg === 'Org2MSP' && (!!formData.file || !!fileName)
      };
      
      const updatedUsers = [...registeredUsers, newUser];
      setRegisteredUsers(updatedUsers);
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      // Reset form
      setFormData({
        username: '',
        password: '',
        file: null
      });
      setFileName('');
      setSuccess('User registered successfully!');
      
    } catch (error) {
      console.error('Registration Error:', error);
      setError(error.message || 'Failed to register user. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSuccess('');
    setError('');
  };

  const handleDownloadSamplePDF = () => {
    // In a real app, this would download a sample PDF
    alert('In a real app, this would download a sample PDF');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <AdminIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Admin Dashboard
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
      
      <Container maxWidth="xl" sx={{ mt: 10, mb: 4, flex: 1 }}>
        <Grid container spacing={3}>
          {/* Left column - Registration Form */}
          <Grid item xs={12} md={7}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonAddIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem' }}>
                    Register New {adminOrg === 'Org1MSP' ? 'Doctor' : 'Patient'}
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                {/* Organization Info */}
                <Alert severity="info" sx={{ mb: 3 }}>
                  You are registered as an admin for {adminOrg === 'Org1MSP' ? 'Doctor Organization (Org1MSP)' : 'Patient Organization (Org2MSP)'}.
                  You can only add users to your organization.
                </Alert>
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <KeyIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    
                    {/* Only show file upload for patient organization admins */}
                    {adminOrg === 'Org2MSP' && (
                      <Grid item xs={12}>
                        <Paper
                          variant="outlined"
                          sx={{
                            p: 3,
                            textAlign: 'center',
                            borderStyle: 'dashed',
                            borderColor: 'primary.light',
                            bgcolor: 'background.paper',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'rgba(52, 152, 219, 0.04)'
                            }
                          }}
                        >
                          <input
                            accept=".json"
                            id="file-upload"
                            type="file"
                            hidden
                            onChange={handleFileChange}
                          />
                          <Typography variant="body1" color="text.secondary" gutterBottom>
                            Upload Patient Health Record (JSON)
                          </Typography>
                          <label htmlFor="file-upload">
                            <Button
                              variant="outlined"
                              component="span"
                              startIcon={<UploadIcon />}
                              sx={{ mb: 2 }}
                            >
                              Browse Files
                            </Button>
                          </label>
                          
                          {fileName ? (
                            <Box sx={{ mt: 2 }}>
                              <Chip 
                                label={fileName}
                                color="primary"
                                onDelete={() => {
                                  setFileName('');
                                  setFormData({...formData, file: null});
                                }}
                                icon={<AssignmentIcon />}
                              />
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              JSON files only, max 10MB
                            </Typography>
                          )}
                          
                          <Button
                            onClick={handleDownloadSamplePDF}
                            variant="text"
                            size="small"
                            sx={{ mt: 2 }}
                          >
                            Download Sample PDF
                          </Button>
                        </Paper>
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={loading}
                        sx={{ py: 1.5 }}
                      >
                        {loading ? (
                          <CircularProgress size={24} />
                        ) : (
                          `Register ${adminOrg === 'Org1MSP' ? 'Doctor' : 'Patient'}`
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Right column - Recently Registered Users */}
          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h5" component="h2">
                    Recently Registered Users
                  </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                {registeredUsers.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No users registered yet
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                    {registeredUsers.slice(-5).reverse().map((user) => (
                      <ListItem
                        key={user.id}
                        alignItems="flex-start"
                        divider
                        sx={{
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgcolor: 'rgba(52, 152, 219, 0.08)',
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: user.mspId === 'Org1MSP' ? '#3498DB' : '#2ECC71' }}>
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography
                                variant="subtitle1"
                                component="span"
                                sx={{ fontWeight: 500 }}
                              >
                                {user.username}
                              </Typography>
                              <Chip
                                label={user.mspId === 'Org1MSP' ? 'Doctor' : 'Patient'}
                                size="small"
                                color={user.mspId === 'Org1MSP' ? 'secondary' : 'success'}
                                sx={{ ml: 1, fontSize: '0.75rem' }}
                              />
                            </Box>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                component="span"
                                style={{ fontSize: '1rem' }}
                              >
                                Registered: {new Date(user.createdAt).toLocaleString()}
                              </Typography>
                              {user.fileAttached && (
                                <Chip
                                  label="PDF Attached"
                                  size="small"
                                  icon={<AssignmentIcon />}
                                  variant="outlined"
                                  sx={{ ml: 1, fontSize: '0.7rem' }}
                                />
                              )}
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
            
            {/* System Statistics Card */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  System Statistics
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(52, 152, 219, 0.1)' }}>
                      <Typography variant="h4" color="secondary.main" fontWeight="bold">
                        {registeredUsers.filter(u => u.mspId === 'Org1MSP').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Doctors
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(46, 204, 113, 0.1)' }}>
                      <Typography variant="h4" color="success.main" fontWeight="bold">
                        {registeredUsers.filter(u => u.mspId === 'Org2MSP').length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Patients
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12}>
                    <Paper sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(44, 62, 80, 0.1)' }}>
                      <Typography variant="h4" color="primary.main" fontWeight="bold">
                        {registeredUsers.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Users
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
      
      {/* Success Notification */}
      <Snackbar 
        open={!!success} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {success}
        </Alert>
      </Snackbar>
      
      {/* Error Notification (for snackbar errors, not form validation) */}
      <Snackbar 
        open={!!error && !error.includes('Please fill')} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;
