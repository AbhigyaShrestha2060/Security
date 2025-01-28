import {
  AttachMoney,
  Category,
  CloudUpload,
  DeleteOutline,
  Description,
  Label,
  Save,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createProductApi } from '../../../Apis/api';

const AddGadgetPage = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'laptop',
    imageFile: null,
  });
  const [errors, setErrors] = useState({});
  const [previewUrl, setPreviewUrl] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGadget = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const submitFormData = new FormData();
    submitFormData.append('productName', formData.name);
    submitFormData.append('productPrice', formData.price);
    submitFormData.append('productCategory', formData.category);
    submitFormData.append('productDescription', formData.description);
    if (formData.imageFile) {
      submitFormData.append('productImage', formData.imageFile);
    }

    setLoading(true);
    try {
      const res = await createProductApi(submitFormData);
      if (res.status === 201) {
        toast.success('Gadget added successfully');
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'laptop',
          imageFile: null,
        });
        setPreviewUrl(null);
      }
    } catch (error) {
      toast.error('Error adding gadget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Paper
        elevation={0}
        sx={{ p: 2, mb: 3 }}>
        <Typography
          variant='h4'
          gutterBottom
          sx={{ fontWeight: 'medium' }}>
          Add New Gadget
        </Typography>
        <Typography color='text.secondary'>
          Fill in the information below to add a new gadget to your inventory
        </Typography>
      </Paper>

      <Card elevation={3}>
        <CardContent>
          <form onSubmit={handleAddGadget}>
            <Grid
              container
              spacing={3}>
              {/* Basic Information */}
              <Grid
                item
                xs={12}
                md={6}>
                <TextField
                  label='Product Name'
                  variant='outlined'
                  fullWidth
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Label />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}>
                <TextField
                  label='Price'
                  variant='outlined'
                  fullWidth
                  type='number'
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  error={!!errors.price}
                  helperText={errors.price}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AttachMoney />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid
                item
                xs={12}
                md={6}>
                <FormControl
                  fullWidth
                  variant='outlined'>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    label='Category'
                    startAdornment={
                      <InputAdornment position='start'>
                        <Category />
                      </InputAdornment>
                    }>
                    <MenuItem value='laptop'>Laptop</MenuItem>
                    <MenuItem value='accessories'>Accessories</MenuItem>
                    <MenuItem value='speaker'>Speaker</MenuItem>
                    <MenuItem value='mobile'>Mobile</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid
                item
                xs={12}
                md={6}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                  }}>
                  <input
                    type='file'
                    accept='image/*'
                    id='image-upload'
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor='image-upload'
                    style={{ width: '100%' }}>
                    <Button
                      variant='outlined'
                      component='span'
                      startIcon={<CloudUpload />}
                      fullWidth
                      sx={{ height: '56px' }} // Match height with other inputs
                    >
                      {formData.imageFile ? 'Change Image' : 'Upload Image'}
                    </Button>
                  </label>
                </Box>
              </Grid>

              <Grid
                item
                xs={12}>
                <TextField
                  label='Description'
                  variant='outlined'
                  multiline
                  rows={4}
                  fullWidth
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  error={!!errors.description}
                  helperText={errors.description}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <Description />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {previewUrl && (
                <Grid
                  item
                  xs={12}
                  md={6}>
                  <Paper
                    elevation={2}
                    sx={{ p: 2, position: 'relative' }}>
                    <IconButton
                      size='small'
                      color='error'
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                      onClick={() => {
                        setPreviewUrl(null);
                        setFormData({ ...formData, imageFile: null });
                      }}>
                      <DeleteOutline />
                    </IconButton>
                    <img
                      src={previewUrl}
                      alt='Preview'
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                      }}
                    />
                  </Paper>
                </Grid>
              )}

              <Grid
                item
                xs={12}>
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant='contained'
                    color='primary'
                    type='submit'
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={20} /> : <Save />
                    }
                    size='large'>
                    {loading ? 'Saving...' : 'Save Gadget'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddGadgetPage;
