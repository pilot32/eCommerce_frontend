import { Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Products from "../pages/Products";
import Categories from "../pages/Categories";

import AdminLayout from "../layout/AdminLayout";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/products"
        element={
          <AdminLayout>
            <Products />
          </AdminLayout>
        }
      />

      <Route
        path="/categories"
        element={
          <AdminLayout>
            <Categories />
          </AdminLayout>
        }
      />
    </Routes>
  );
}