# Gadget Mart - Backend

## Overview

Gadget Mart is an online e-commerce platform designed for tech gadgets. The backend of Gadget Mart is built with Node.js and provides functionalities for user management, product handling, cart management, favorites, orders, and more.

## Features

### User APIs

- **POST** `/api/user/create` - Register a new user
- **POST** `/api/user/login` - User login
- **POST** `/api/user/forgot_password` - Forgot password
- **POST** `/api/user/reset_password` - Reset password
- **GET** `/api/user/get_single_user` - Get the current user profile
- **GET** `/api/user/get_all_user` - Get all users
- **PUT** `/api/user/update_profile` - Update user profile

### Product APIs

- **POST** `/api/product/create` - Create a new product
- **GET** `/api/product/get_all` - Get all products
- **GET** `/api/product/get/:id` - Get a single product by ID
- **PUT** `/api/product/update/:id` - Update a product by ID
- **DELETE** `/api/product/delete/:id` - Delete a product by ID
- **GET** `/api/product/pagination` - Get products with pagination
- **GET** `/api/product/count` - Get total number of products

### Favorite APIs

- **POST** `/api/favourite/add` - Add a product to favorites
- **GET** `/api/favourite/get` - Get all favorite products for the user
- **GET** `/api/favourite/all` - Get all favorite products
- **DELETE** `/api/favourite/delete/:id` - Remove a product from favorites

### Cart APIs

- **POST** `/api/cart/add` - Add a product to the cart
- **GET** `/api/cart/all` - Get all items in the cart
- **PUT** `/api/cart/update/:id` - Update a cart item by ID
- **DELETE** `/api/cart/delete/:id` - Remove a cart item by ID
- **PUT** `/api/cart/status` - Update cart status

### Order APIs

- **POST** `/api/order/create` - Create a new order
- **GET** `/api/order/get` - Get all orders
- **GET** `/api/order/user` - Get all orders for a specific user
- **PUT** `/api/order/update/:id` - Update an order by ID
- **PUT** `/api/order/update/:id` - Update order status

## Technologies

- **Node.js** - Server-side runtime environment
- **Express.js** - Backend framework for building web applications
- **MongoDB** - NoSQL database for storing and managing data
- **Mongoose** - Object Data Modeling library for MongoDB and Node.js
- **Axios** - HTTP client for making requests

## Environment Variables

- `PORT` - Port number for the server
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables
4. Run the server with `npm start` or `npm run dev` for development mode

## Author

Safal Pandey
