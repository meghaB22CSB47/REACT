import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  Divider,
  Paper
} from '@mui/material';
import {
  Security as SecurityIcon,
  Lock as LockIcon,
  Devices as DevicesIcon,
  HealthAndSafety as HealthAndSafetyIcon
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Secure Data Management',
      description: 'Blockchain ensures tamper-proof medical records with comprehensive audit trails.',
      icon: <SecurityIcon fontSize="large" color="primary" />
    },
    {
      title: 'Enhanced Privacy',
      description: 'Patients retain complete ownership and granular control over their medical data.',
      icon: <LockIcon fontSize="large" color="primary" />
    },
    {
      title: 'Seamless Access',
      description: 'Healthcare providers access records with patient consent through a streamlined process.',
      icon: <DevicesIcon fontSize="large" color="primary" />
    }
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header/Navigation */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <HealthAndSafetyIcon sx={{ fontSize: 28, mr: 1 }} />
            <Typography variant="h5" component="div" fontWeight={600}>
              HealthLink
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            color="secondary"
            onClick={() => window.location.href = '/login'}
            sx={{ 
              borderRadius: 2,
              boxShadow: 2,
              fontWeight: 500,
              px: 3
            }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box 
        sx={{ 
          py: 10, 
          background: 'linear-gradient(120deg, #2C3E50 30%, #3498DB 90%)',
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography variant="h2" fontWeight={700} gutterBottom>
                Secure Health Records on Blockchain
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
                HealthLink provides a decentralized platform for managing Electronic Health Records (EHR) with security, privacy, and patient control.
              </Typography>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => window.location.href = '/login'}
                sx={{ 
                  borderRadius: 2,
                  py: 1.5,
                  px: 4,
                  fontSize: '1.1rem',
                  fontWeight: 500,
                  backgroundColor: '#1ABC9C',
                  '&:hover': {
                    backgroundColor: '#16A085'
                  }
                }}
              >
                Get Started
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box 
                component="img"
                src="https://cdn.pixabay.com/photo/2017/10/04/09/56/laboratory-2815640_1280.jpg"
                alt="Healthcare"
                sx={{ 
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: 3
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={600} textAlign="center" gutterBottom>
            Key Features
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            Built on Hyperledger Fabric for enterprise-grade security and performance
          </Typography>
          
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 4
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                    <Box sx={{ mb: 2 }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" component="h3" fontWeight={600} gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 8, bgcolor: '#F8FAFC' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" fontWeight={600} textAlign="center" gutterBottom>
            How It Works
          </Typography>
          <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 6 }}>
            A seamless workflow for managing healthcare data
          </Typography>
          
          <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight={700} sx={{ mb: 1 }}>
                    01
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    Patient Registers
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Patients create an account and maintain control of their medical records.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight={700} sx={{ mb: 1 }}>
                    02
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    Doctor Requests Access
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Healthcare providers request permission to view patient records.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" color="primary" fontWeight={700} sx={{ mb: 1 }}>
                    03
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    Secure Collaboration
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                    Permissioned access allows healthcare coordination with full auditability.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 4, 
          bgcolor: 'primary.main', 
          color: 'white',
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <HealthAndSafetyIcon sx={{ fontSize: 24, mr: 1 }} />
                <Typography variant="h6" fontWeight={600}>
                  HealthLink
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Revolutionizing healthcare data management through blockchain technology. 
                Secure, private, and patient-centered.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: { md: 'flex-end' } }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  Contact Us
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  support@healthlink.com
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  +1 (555) 123-4567
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.2)' }} />
          <Typography variant="body2" align="center" sx={{ opacity: 0.7 }}>
            © 2025 HealthLink. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
