import axios from 'axios';

// Creating backend config
const Api = axios.create({
  baseURL: 'http://localhost:5000/',
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

const config = {
  headers: {
    authorization: 'Bearer ' + localStorage.getItem('token'),
  },
};

const jsonConfig = {
  headers: {
    'Content-Type': 'application/json',
    authorization: 'Bearer ' + localStorage.getItem('token'),
  },
};

// Register user
export const registerUserApi = (data) => Api.post('/api/user/create', data);

// Login user
export const loginUserApi = (data) => Api.post('/api/user/login', data);

export const verifyMfaCodeApi = (data) => Api.post('/api/user/verifyOTP', data);

// create product API
export const createProductApi = (data) => Api.post('/api/product/create', data);

// get all products API
export const getProductsApi = () => Api.get('/api/product/get_all');

// get single product API
export const getProductApi = (id) => Api.get(`/api/product/get/${id}`);

// update product API
export const updateProductApi = (id, data) =>
  Api.put(`/api/product/update/${id}`, data);

// delete product API
export const deleteProductApi = (id) => Api.delete(`/api/product/delete/${id}`);

// forgot password API
export const forgotPasswordApi = (data) =>
  Api.post('/api/user/forgot_password', data);

// pagination API
export const paginationApi = (page, limit) =>
  Api.get(`/api/product/pagination?page=${page}&limit=${limit}`);

export const getProductCountApi = () => Api.get('/api/product/count');

// reset password API
export const resetPasswordApi = (data) =>
  Api.post('/api/user/reset_password', data);

export const addToFavoriteApi = (data) =>
  Api.post('/api/favourite/add', data, config);

// get favorite by user
export const getFavoriteByUserApi = () => Api.get('/api/favourite/get', config);

// get single user
export const getSingleUserApi = () =>
  Api.get(`/api/user/get_single_user`, config);

// get all user
export const getAllUserApi = () => Api.get('/api/user/get_all_user');

// update profile
export const updateProfileApi = (id, userData) =>
  Api.put(`/api/user/update_profile`, userData, config);

// add to cart
export const addToCartApi = (data) => Api.post('/api/cart/add', data, config);

// get all cart
export const getAllCartApi = () => Api.get('/api/cart/all', config);

// update cart
export const updateCartApi = (id, data) =>
  Api.put(`/api/cart/update/${id}`, data, config);

// delete cart
export const deleteCartApi = (id) =>
  Api.delete(`/api/cart/delete/${id}`, config);

// get all favorite
export const getAllFavoriteApi = () => Api.get('/api/favourite/all', config);

// delete favorite
export const deleteFromFavoriteApi = (id) =>
  Api.delete(`/api/favourite/delete/${id}`, config);

// get orders/bills
export const getOrdersApi = () => Api.get('/api/order/get', config);

// get user orders
export const getUserOrdersApi = () => Api.get('/api/order/user', config);

// create order
export const createOrderApi = (data) =>
  Api.post('/api/order/create', data, jsonConfig);

// update order
export const updateOrderApi = (id, data) =>
  Api.put(`/api/order/update/${id}`, data, config);

// update Status order
export const updateOrderStatusApi = (id, data) =>
  Api.put(`/api/order/update/${id}`, data, config);

// update carts status
export const updateCartStatusApi = (data) =>
  Api.put(`/api/cart/status`, data, config);
