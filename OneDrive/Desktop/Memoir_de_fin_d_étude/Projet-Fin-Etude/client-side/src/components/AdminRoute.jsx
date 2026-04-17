import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return currentUser.role === "admin" ? <Outlet /> : <Navigate to="/" />;
}

export default AdminRoute;
