import { Link as RouterLink } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';

function Home() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        marginTop: '100px',
        padding: '20px',
      }}>
      <Typography
        variant="h4"
        component="h4"
        sx={{ fontWeight: 700, color: '#333', marginBottom: '15px' }}>
        Welcome to Dressed™
      </Typography>

      <Typography
        variant="h6"
        component="h6"
        sx={{ color: '#555', marginBottom: '30px' }}>
        Select your portal to get started with fashion design and sourcing.
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
          marginTop: '20px',
        }}>
        <Button
          variant="contained"
          component={RouterLink}
          to="/designer"
          size="large"
          sx={{
            backgroundColor: '#333',
            color: 'white',
            '&:hover': { backgroundColor: '#555' },
            padding: '12px 30px',
            fontSize: '1.1rem',
            borderRadius: '8px',
          }}>
          Go to Designer Portal
        </Button>

        <Button
          variant="contained"
          component={RouterLink}
          to="/supplier"
          size="large"
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            '&:hover': { backgroundColor: '#66BB6A' },
            padding: '12px 30px',
            fontSize: '1.1rem',
            borderRadius: '8px',
          }}>
          Go to Supplier Portal
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
