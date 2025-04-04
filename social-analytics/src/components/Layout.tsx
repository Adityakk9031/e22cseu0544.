import React from 'react';
import { AppBar, Toolbar, Typography, Container, Box, Button, useTheme, Paper } from '@mui/material';
import { Link, Outlet, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Layout: React.FC = () => {
  const theme = useTheme();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="primary" elevation={0}>
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}>
              Social Analytics
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/"
                startIcon={<HomeIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  bgcolor: isActive('/') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Feed
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/top-users"
                startIcon={<PeopleIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  bgcolor: isActive('/top-users') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Top Users
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/trending"
                startIcon={<TrendingUpIcon />}
                sx={{ 
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  bgcolor: isActive('/trending') ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                Trending
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 3, 
            bgcolor: 'background.paper',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Outlet />
        </Paper>
      </Container>
      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          bgcolor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
          mt: 'auto'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Social Analytics | Real-time insights for your social media
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 