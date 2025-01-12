import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addToCartApi,
  deleteCartApi,
  getAllCartApi,
  updateCartApi,
} from "./Apis/api";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AboutUs from "./pages/about_us/AboutUs";
import AdminDashboard from "./pages/admin_dashboard/AdminDashboard";
import Cart from "./pages/cart_page/Cart";
import ContactUs from "./pages/contact_us/ContactUs";
import Favourites from "./pages/favourites_page/Favourites";
import ForgotPassword from "./pages/forgot_password/ForgotPassword";
import Homepage from "./pages/homepage/Homepage";
import LandingPage from "./pages/landing_page/LandingPage";
import Login from "./pages/login/Login";
import OrderList from "./pages/order_list/OrderList";
import Register from "./pages/register/Register";
import UpdateProfile from "./pages/update_profile/UpdateProfile";
import AdminRoutes from "./protected/AdminRoutes";

const App = () => {
  const location = useLocation();
  const [cart, setCart] = useState([]);

  const showFooter = !["/login", "/register"].includes(location.pathname);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await getAllCartApi();
      setCart(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart([]);
    }
  };

  // In App.js

  const addToCart = async (product) => {
    try {
      const existingItem = cart.find((item) => item.productId === product._id);
      if (existingItem) {
        await updateCartApi(existingItem._id, {
          quantity: existingItem.quantity + 1,
        });
      } else {
        await addToCartApi({
          productId: product._id,
          quantity: 1,
          total: product.productPrice, // Add the total price
        });
      }
      await fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateQuantity = async (id, newQuantity) => {
    try {
      await updateCartApi(id, { quantity: newQuantity });
      await fetchCart();
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const removeFromCart = async (id) => {
    try {
      await deleteCartApi(id);
      await fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <div className="App">
      <Navbar
        cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)}
      />
      <ToastContainer />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route
          path="/"
          element={<LandingPage cart={cart} addToCart={addToCart} />}
        />
        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              updateQuantity={updateQuantity}
              removeFromCart={removeFromCart}
            />
          }
        />
        <Route path="/favourites" element={<Favourites />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/profile" element={<UpdateProfile />} />
        <Route path="/landingpage" element={<LandingPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/orderlist" element={<OrderList />} />
        <Route path="/userdashboard" element={<Homepage />} />
      </Routes>
      {showFooter && <Footer />}
    </div>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
