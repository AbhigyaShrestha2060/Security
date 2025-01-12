import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user != null && user.role === "admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default AdminRoutes;
