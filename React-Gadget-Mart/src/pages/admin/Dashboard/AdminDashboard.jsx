import {
  Add,
  Category,
  Delete,
  Edit,
  Headphones,
  Laptop,
  Search,
  ShoppingCart,
  Smartphone,
  Speaker,
  TrendingUp,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';
import { deleteProductApi, getProductsApi } from '../../../Apis/api';

const AdminDashboard = () => {
  const [gadgets, setGadgets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGadgets, setFilteredGadgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    getProductsApi()
      .then((res) => {
        setGadgets(res.data.products);
        setFilteredGadgets(res.data.products);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = gadgets.filter(
      (gadget) =>
        gadget.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        gadget.productCategory.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGadgets(filtered);
  }, [searchTerm, gadgets]);

  const handleDelete = (id) => {
    const confirm = window.confirm(
      'Are you sure you want to delete this gadget?'
    );
    if (confirm) {
      deleteProductApi(id).then((res) => {
        setGadgets((prev) => prev.filter((gadget) => gadget._id !== id));
        setFilteredGadgets((prev) =>
          prev.filter((gadget) => gadget._id !== id)
        );
      });
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'laptop':
        return <Laptop />;
      case 'accessories':
        return <Headphones />;
      case 'speaker':
        return <Speaker />;
      case 'mobile':
        return <Smartphone />;
      default:
        return <Category />;
    }
  };

  const categoryData = [
    {
      name: 'Laptop',
      value: gadgets.filter((g) => g.productCategory === 'laptop').length,
    },
    {
      name: 'Accessories',
      value: gadgets.filter((g) => g.productCategory === 'accessories').length,
    },
    {
      name: 'Speaker',
      value: gadgets.filter((g) => g.productCategory === 'speaker').length,
    },
    {
      name: 'Mobile',
      value: gadgets.filter((g) => g.productCategory === 'mobile').length,
    },
  ];

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.warning.main,
    theme.palette.error.main,
  ];

  const StatCard = ({ title, value, icon, trend }) => (
    <Card elevation={2}>
      <CardContent>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          mb={2}>
          <Avatar sx={{ bgcolor: theme.palette.primary.main }}>{icon}</Avatar>
          <Typography
            variant='caption'
            color='success.main'
            sx={{ display: 'flex', alignItems: 'center' }}>
            <TrendingUp sx={{ fontSize: 16, mr: 0.5 }} />
            {trend}
          </Typography>
        </Box>
        <Typography
          variant='h4'
          fontWeight='bold'
          mb={1}>
          {value}
        </Typography>
        <Typography
          variant='body2'
          color='text.secondary'>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ width: '100%' }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <>
      <Box
        p={3}
        sx={{ bgcolor: 'background.default' }}>
        <Typography
          variant='h4'
          mb={3}
          fontWeight='bold'>
          Dashboard
        </Typography>

        {/* Stats Section */}
        <Grid
          container
          spacing={3}
          mb={4}>
          <Grid
            item
            xs={12}
            md={4}>
            <StatCard
              title='Total Gadgets'
              value={gadgets.length}
              icon={<ShoppingCart />}
              trend='+12.5%'
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}>
            <StatCard
              title='Categories'
              value='4'
              icon={<Category />}
              trend='+0%'
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={4}>
            <StatCard
              title='Average Price'
              value={`Rs. ${
                gadgets.length > 0
                  ? (
                      gadgets.reduce(
                        (sum, g) => sum + parseFloat(g.productPrice),
                        0
                      ) / gadgets.length
                    ).toFixed(2)
                  : '0.00'
              }`}
              icon={<TrendingUp />}
              trend='+8.2%'
            />
          </Grid>
        </Grid>

        {/* Charts and Table Section */}
        <Grid
          container
          spacing={3}>
          {/* Chart Section */}
          <Grid
            item
            xs={12}
            md={5}>
            <Paper
              elevation={2}
              sx={{ p: 3, height: '100%' }}>
              <Typography
                variant='h6'
                mb={3}>
                Category Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer
                  width='100%'
                  height='100%'>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      label>
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Table Section */}
          <Grid
            item
            xs={12}
            md={7}>
            <Paper
              elevation={2}
              sx={{ p: 3 }}>
              <Box
                display='flex'
                justifyContent='space-between'
                alignItems='center'
                mb={3}>
                <Typography variant='h6'>Gadget Inventory</Typography>
                <Button
                  variant='contained'
                  color='primary'
                  startIcon={<Add />}
                  href='/admin/add-gadget'>
                  Add Gadget
                </Button>
              </Box>

              <TextField
                label='Search Gadgets'
                variant='outlined'
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ color: 'text.secondary', mr: 1 }} />
                  ),
                }}
                sx={{ mb: 3 }}
              />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Price</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell align='right'>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGadgets.map((gadget) => (
                      <TableRow
                        key={gadget._id}
                        sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell>
                          <Avatar
                            src={`https://localhost:5000/images/${gadget.productImage}`}
                            alt={gadget.productName}
                            sx={{ width: 56, height: 56 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant='subtitle2'>
                            {gadget.productName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color='primary.main'
                            fontWeight='medium'>
                            Rs. {gadget.productPrice}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getCategoryIcon(gadget.productCategory)}
                            label={gadget.productCategory}
                            size='small'
                            color='primary'
                            variant='outlined'
                          />
                        </TableCell>
                        <TableCell align='right'>
                          <Tooltip title='Edit'>
                            <IconButton
                              color='primary'
                              href={`/edit-gadget/${gadget._id}`}
                              size='small'>
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title='Delete'>
                            <IconButton
                              color='error'
                              onClick={() => handleDelete(gadget._id)}
                              size='small'>
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AdminDashboard;
