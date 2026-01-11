import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const ACTIVE_COLOR = '#4CAF50';
const INACTIVE_COLOR = 'white';

const Navbar = () => {
  const location = useLocation();

  const getTextColor = (path) => {
    const isActive = location.pathname === path;
    return isActive ? ACTIVE_COLOR : INACTIVE_COLOR;
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#333', width: '100%' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            fontWeight: 'bold',
            fontSize: '1.2rem',
            color: getTextColor('/'),
            textDecoration: 'none',
            '&:hover': { color: '#ddd' },
          }}>
          Dressed™
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/designer"
            sx={{
              color: getTextColor('/designer'),
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { color: '#ddd' },
            }}>
            Designer Portal
          </Button>

          <Button
            component={RouterLink}
            to="/supplier"
            sx={{
              color: getTextColor('/supplier'),
              textTransform: 'none',
              fontSize: '1rem',
              '&:hover': { color: '#ddd' },
            }}>
            Supplier Portal
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
