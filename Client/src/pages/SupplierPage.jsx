import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function SupplierPage() {
  const [designs, setDesigns] = useState([]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [quoteData, setQuoteData] = useState({ amount: '', message: '' });
  const [viewOpen, setViewOpen] = useState(false);
  const [currentQuotes, setCurrentQuotes] = useState([]);
  const [currentOrders, setCurrentOrders] = useState([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [viewingDesignName, setViewingDesignName] = useState('');

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const res = await api.get('/designs');
      setDesigns(res.data);
    } catch (err) {
      console.error('Error loading designs', err);
    }
  };

  const handleOpenSubmit = (design) => {
    setSelectedDesign(design);
    setSubmitOpen(true);
  };

  const submitQuote = async () => {
    try {
      await api.post('/quotes', {
        designId: selectedDesign.id,
        supplierName: 'Supplier A',
        amount: parseFloat(quoteData.amount),
        message: quoteData.message,
      });
      alert('Quote Sent Successfully!');
      setSubmitOpen(false);
      setQuoteData({ amount: '', message: '' });
    } catch (err) {
      alert('Failed to send quote');
    }
  };

  const handleViewQuotes = async (design) => {
    setViewingDesignName(design.name);
    setViewOpen(true);
    setLoadingQuotes(true);
    setCurrentQuotes([]);
    setCurrentOrders([]);

    try {
      // Fetch both Quotes and Orders to cross-reference
      const [quotesRes, ordersRes] = await Promise.all([
        api.get(`/quotes/design/${design.id}`),
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

  const handleShipOrder = async (orderId) => {
    try {
      await api.put(`/orders/${orderId}/ship`);
      alert('Order marked as Shipped!');

      const ordersRes = await api.get('/orders');
      setCurrentOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to ship', err);
      alert('Failed to update status');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 10 }}>
      <Typography variant="h4" gutterBottom>
        Supplier Hub
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Browse designs and submit your best offer.
      </Typography>

      <Grid container spacing={3}>
        {designs.map((design) => (
          <Grid item xs={12} sm={6} md={4} key={design.id}>
            <Card
              sx={{
                width: '280px',
                height: '380px',
                display: 'flex',
                flexDirection: 'column',
              }}>
              {design.imageUrl && design.imageUrl.endsWith('.pdf') ? (
                <Box
                  sx={{
                    height: 200,
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
                      : 'https://via.placeholder.com/200'
                  }
                  alt={design.name}
                />
              )}

              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{design.name}</Typography>
                <Chip
                  label={design.category}
                  size="small"
                  color="secondary"
                  sx={{ mb: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {design.description}
                </Typography>
              </CardContent>

              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  borderTop: '1px solid #eee',
                }}>
                <Button
                  sx={{ flex: 1, borderRadius: 0, py: 1.5 }}
                  startIcon={<VisibilityIcon />}
                  onClick={() => handleViewQuotes(design)}>
                  View Quotes
                </Button>
                <Button
                  variant="contained"
                  sx={{ flex: 1, borderRadius: 0, py: 1.5 }}
                  startIcon={<AttachMoneyIcon />}
                  onClick={() => handleOpenSubmit(design)}>
                  Quote This
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        maxWidth="sm"
        fullWidth>
        <DialogTitle>Quote for: {selectedDesign?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Price Amount ($)"
            type="number"
            fullWidth
            variant="outlined"
            value={quoteData.amount}
            onChange={(e) =>
              setQuoteData({ ...quoteData, amount: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Message (e.g., Timeline, Material)"
            multiline
            rows={3}
            fullWidth
            variant="outlined"
            value={quoteData.message}
            onChange={(e) =>
              setQuoteData({ ...quoteData, message: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSubmitOpen(false)}>Cancel</Button>
          <Button onClick={submitQuote} variant="contained" color="primary">
            Send Quote
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        fullWidth
        maxWidth="sm">
        <DialogTitle>Quotes for: {viewingDesignName}</DialogTitle>
        <DialogContent dividers>
          {loadingQuotes ? (
            <Typography sx={{ py: 2, textAlign: 'center' }}>
              Loading...
            </Typography>
          ) : currentQuotes.length === 0 ? (
            <Typography align="center" color="text.secondary" sx={{ py: 3 }}>
              No quotes submitted for this design yet.
            </Typography>
          ) : (
            <List>
              {currentQuotes.map((quote) => {
                const relatedOrder = currentOrders.find(
                  (o) => o.quoteId === quote.id
                );

                return (
                  <React.Fragment key={quote.id}>
                    <ListItem
                      alignItems="flex-start"
                      secondaryAction={
                        relatedOrder ? (
                          <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="flex-end"
                            gap={1}>
                            <Chip
                              label={
                                relatedOrder.status === 'Shipped'
                                  ? 'SHIPPED'
                                  : 'ORDER PLACED'
                              }
                              color={
                                relatedOrder.status === 'Shipped'
                                  ? 'default'
                                  : 'success'
                              }
                              size="small"
                              icon={<CheckCircleIcon />}
                            />
                            {relatedOrder.status !== 'Shipped' && (
                              <Button
                                variant="contained"
                                color="primary"
                                size="small"
                                startIcon={<LocalShippingIcon />}
                                onClick={() =>
                                  handleShipOrder(relatedOrder.id)
                                }>
                                Ship Item
                              </Button>
                            )}
                          </Box>
                        ) : null
                      }>
                      <ListItemText
                        primary={
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            pr={18}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {quote.supplierName}
                            </Typography>
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              fontWeight="bold">
                              ${quote.amount}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}>
                              {quote.message || 'No description provided.'}
                            </Typography>
                            <Typography
                              variant="caption"
                              display="block"
                              sx={{ mt: 1, color: '#999' }}>
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </Typography>
                            {relatedOrder && (
                              <Typography
                                variant="caption"
                                sx={{
                                  color: 'green',
                                  fontWeight: 'bold',
                                  display: 'block',
                                  mt: 1,
                                }}>
                                ★ This quote was accepted by the designer.
                              </Typography>
                            )}
                          </>
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
          <Button onClick={() => setViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default SupplierPage;
