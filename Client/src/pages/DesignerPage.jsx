import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Container,
  Typography,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Box,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoneAllIcon from '@mui/icons-material/DoneAll';

function DesignerPage() {
  const [designs, setDesigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    file: null,
  });

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [currentQuotes, setCurrentQuotes] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [selectedDesignId, setSelectedDesignId] = useState(null);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  useEffect(() => {
    fetchDesigns();
    fetchCategories();
  }, []);

  const fetchDesigns = async () => {
    try {
      const res = await api.get('/designs');
      setDesigns(res.data);
    } catch (err) {
      console.error('Failed to load designs', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/designs/categories');
      setCategories(res.data);
    } catch (err) {
      setCategories(['Men', 'Women', 'Boy', 'Girl', 'Unisex']);
      console.error('Failed to load categories', err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const data = new FormData();
    data.append('Name', formData.name);
    data.append('Category', formData.category);
    data.append('Description', formData.description);
    if (formData.file) {
      data.append('File', formData.file);
    }

    try {
      await api.post('/designs', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setOpen(false);
      setFormData({ name: '', category: '', description: '', file: null });
      fetchDesigns();
      alert('Design uploaded successfully!');
    } catch (error) {
      console.error('Upload failed', error);
      alert('Failed to upload design. Check API gateway routing.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuotes = async (designId) => {
    setSelectedDesignId(designId);
    setLoadingQuotes(true);
    setQuoteModalOpen(true);
    setCurrentQuotes([]);
    setCurrentOrders([]);

    try {
      const [quotesRes, ordersRes] = await Promise.all([
        api.get(`/quotes/design/${designId}`),
        api.get('/orders'),
      ]);

      setCurrentQuotes(quotesRes.data);
      setCurrentOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handlePlaceOrder = async (quote) => {
    if (
      !window.confirm(
        `Are you sure you want to place an order with ${quote.supplierName} for $${quote.amount}?`
      )
    ) {
      return;
    }

    try {
      await api.post('/orders', {
        quoteId: quote.id,
        designId: quote.designId,
        supplierName: quote.supplierName,
        amount: quote.amount,
      });

      alert('Order placed successfully!');

      await handleViewQuotes(selectedDesignId);
    } catch (err) {
      console.error('Failed to place order', err);
      alert('Failed to place order');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Designer Studio
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your portfolio and request quotes from suppliers.
      </Typography>

      <Grid container spacing={3}>
        {designs.map((design, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '280px',
                height: '100%',
              }}>
              {design.imageUrl && design.imageUrl.endsWith('.pdf') ? (
                <Box
                  sx={{
                    height: 140,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#f0f0f0',
                    color: '#666',
                  }}>
                  PDF Document
                </Box>
              ) : (
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    design.imageUrl
                      ? `http://localhost:8080${design.imageUrl}`
                      : 'https://via.placeholder.com/150'
                  }
                  alt={design.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">{design.name}</Typography>
                <Chip
                  label={design.category}
                  size="small"
                  color="primary"
                  sx={{ mt: 1, mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {design.description}
                </Typography>
              </CardContent>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 'auto',
                  borderRadius: 0,
                  borderTop: '1px solid #eee',
                }}
                startIcon={<ReceiptLongIcon />}
                onClick={() => handleViewQuotes(design.id)}>
                View Quotes
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Fab
        variant="extended"
        color="primary"
        aria-label="add"
        sx={{ position: 'fixed', bottom: 30, right: 30 }}
        onClick={() => setOpen(true)}>
        <AddIcon /> Add New Design
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm">
        <DialogTitle>Add New Design</DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Design Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleInputChange}
            />
            <TextField
              select
              label="Category"
              name="category"
              fullWidth
              value={formData.category}
              onChange={handleInputChange}>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Description"
              name="description"
              multiline
              rows={3}
              fullWidth
              value={formData.description}
              onChange={handleInputChange}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{ p: 2, borderStyle: 'dashed' }}>
              {formData.file ? formData.file.name : 'Upload Image or PDF'}
              <input
                type="file"
                hidden
                accept="image/*,application/pdf"
                onChange={handleFileChange}
              />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              loading || !formData.name || !formData.category || !formData.file
            }>
            {loading ? 'Uploading...' : 'Submit Design'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
        fullWidth
        maxWidth="sm">
        <DialogTitle>Received Quotes</DialogTitle>
        <DialogContent dividers>
          {loadingQuotes ? (
            <Typography>Loading...</Typography>
          ) : currentQuotes.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
              No quotes received yet.
            </Typography>
          ) : (
            <List>
              {currentQuotes.map((quote) => {
                const isAccepted = currentOrders.some(
                  (order) => order.quoteId === quote.id
                );
                const acceptedOrder = currentOrders.find(
                  (order) => order.quoteId === quote.id
                );

                return (
                  <React.Fragment key={quote.id}>
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        isAccepted ? (
                          <Chip
                            label={
                              acceptedOrder?.status === 'Shipped'
                                ? 'ORDER SHIPPED'
                                : 'QUOTE ACCEPTED'
                            }
                            icon={<DoneAllIcon />}
                            color={
                              acceptedOrder?.status === 'Shipped'
                                ? 'default'
                                : 'success'
                            }
                            variant="outlined"
                            sx={{ fontWeight: 'bold' }}
                          />
                        ) : (
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handlePlaceOrder(quote)}>
                            Accept
                          </Button>
                        )
                      }
                      sx={isAccepted ? { bgcolor: '#e8f5e9' } : {}}>
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            pr={12}>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {quote.supplierName}
                            </Typography>
                            <Typography variant="h6" color="primary">
                              ${quote.amount}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}>
                              {quote.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ mt: 1 }}>
                              Received:{' '}
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQuoteModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default DesignerPage;
