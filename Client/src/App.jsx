import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Box, Toolbar } from '@mui/material';

import Navbar from './components/navbar';
import DesignerPage from './pages/DesignerPage';
import SupplierPage from './pages/SupplierPage';
import Home from './components/home';

function App() {
  return (
    <Router>
      <CssBaseline />

      <div style={{ fontFamily: 'Arial, sans-serif' }}>
        <Navbar />

        <Toolbar />

        <Box sx={{ padding: 3, maxWidth: '800px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/designer" element={<DesignerPage />} />
            <Route path="/supplier" element={<SupplierPage />} />
          </Routes>
        </Box>
      </div>
    </Router>
  );
}

export default App;
