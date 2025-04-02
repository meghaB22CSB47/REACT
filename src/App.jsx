import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import './styles/global.css';

// Import components
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import EHRViewer from './components/EHRViewer';
import DoctorHistory from './components/DoctorHistory';
import Home from './components/Home';
import NotFound from './components/NotFound';
import LoadingScreen from './components/LoadingScreen';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50',
    },
    secondary: {
      main: '#3498DB',
    },
    success: {
      main: '#2ECC71',
    },
    error: {
      main: '#E74C3C',
    },
    background: {
      default: '#F8FAFC',
    },
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14, // Base font size reduced
    h1: {
      fontWeight: 600,
      fontSize: '2.5rem', // Reduced from 3rem+
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem', // Reduced
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem', // Reduced
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem', // Reduced
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.1rem', // Reduced
    },
    h6: {
      fontWeight: 500,
      fontSize: '0.95rem', // Reduced
    },
    body1: {
      fontSize: '0.9rem', // Reduced
    },
    body2: {
      fontSize: '0.85rem', // Reduced
    },
    button: {
      textTransform: 'none', // More modern look without uppercase
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          boxShadow: 'none',
          padding: '8px 16px', // Slightly smaller padding
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3498DB',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3498DB',
          },
        },
        notchedOutline: {
          borderColor: 'rgba(0, 0, 0, 0.23)',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px', // More compact table cells
          fontSize: '0.85rem',
        },
        head: {
          fontWeight: 600,
        },
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.75rem',
        },
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.9rem',
        },
        secondary: {
          fontSize: '0.8rem',
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: '60px !important', // Smaller toolbar
        }
      }
    },
  },
});

const App = () => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    // Check authentication status on component mount
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem('jwt');
    setLoading(true);
    
    if (token) {
      const username = localStorage.getItem('username');
      const mspId = localStorage.getItem('mspId');
      
      setAuthenticated(true);
      
      if (username === 'admin') {
        setUserRole('admin');
      } else if (mspId === 'Org1MSP') {
        setUserRole('doctor');
      } else if (mspId === 'Org2MSP') {
        setUserRole('patient');
      }
    } else {
      setAuthenticated(false);
      setUserRole(null);
    }
    
    setLoading(false);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route 
            path="/login" 
            element={
              authenticated ? 
                <Navigate to={getRedirectPath(userRole)} replace /> : 
                <Login />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/admin" 
            element={
              authenticated && userRole === 'admin' ? 
                <AdminDashboard /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/doctor" 
            element={
              authenticated && userRole === 'doctor' ? 
                <DoctorDashboard /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/ehr/:patientId" 
            element={
              authenticated && userRole === 'doctor' ? 
                <EHRViewer /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/patient" 
            element={
              authenticated && userRole === 'patient' ? 
                <PatientDashboard /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/history/:doctorId" 
            element={
              authenticated && userRole === 'patient' ? 
                <DoctorHistory /> : 
                <Navigate to="/login" replace />
            } 
          />
          
          {/* 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

// Helper function to determine redirect path based on user role
function getRedirectPath(role) {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'doctor':
      return '/doctor';
    case 'patient':
      return '/patient';
    default:
      return '/login';
  }
}

export default App;
