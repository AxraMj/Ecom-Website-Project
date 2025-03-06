import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface OrderItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  shipping: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
  };
  payment: {
    method: 'card' | 'cod';
    cardNumber?: string;
  };
  totalAmount: number;
  status: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returnDialogOpen, setReturnDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [returnReason, setReturnReason] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnRequest = (order: Order) => {
    setSelectedOrder(order);
    setReturnDialogOpen(true);
  };

  const submitReturnRequest = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.post(
        `http://localhost:5000/api/orders/${selectedOrder?._id}/return`,
        { reason: returnReason },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Refresh orders after return request
      fetchOrders();
      setReturnDialogOpen(false);
      setReturnReason('');
      setSelectedOrder(null);
    } catch (err) {
      setError('Failed to submit return request');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Your Orders
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {orders.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>You haven't placed any orders yet.</Typography>
        </Paper>
      ) : (
        orders.map((order) => (
          <Paper key={order._id} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">
                    Order #{order._id.slice(-8)}
                  </Typography>
                  <Chip 
                    label={order.status.toUpperCase()} 
                    color={
                      order.status === 'delivered' ? 'success' :
                      order.status === 'shipped' ? 'info' :
                      order.status === 'processing' ? 'warning' :
                      'default'
                    }
                  />
                </Box>
                <Typography color="text.secondary" variant="body2">
                  Placed on {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                {order.items.map((item) => (
                  <Box key={item.id} sx={{ mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={2} sm={1}>
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: '100%', maxWidth: '50px' }}
                        />
                      </Grid>
                      <Grid item xs={6} sm={8}>
                        <Typography>{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Quantity: {item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item xs={4} sm={3} textAlign="right">
                        <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6">
                    Total: ${order.totalAmount.toFixed(2)}
                  </Typography>
                  {order.status === 'delivered' && (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => handleReturnRequest(order)}
                    >
                      Return Order
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}

      <Dialog open={returnDialogOpen} onClose={() => setReturnDialogOpen(false)}>
        <DialogTitle>Return Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for Return"
            fullWidth
            multiline
            rows={4}
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReturnDialogOpen(false)}>Cancel</Button>
          <Button onClick={submitReturnRequest} variant="contained" color="primary">
            Submit Return Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrdersPage; 