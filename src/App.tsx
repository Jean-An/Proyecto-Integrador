import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import { ClientesPage } from "./pages/dashboard/ClientsPage";
import { ProductosPage } from "./pages/dashboard/ProductsPage";
import { CategoriasPage } from "./pages/dashboard/CategoriesPage";
import { WelcomeSection } from "./components/dashboard/WelcomeSection";
import "./App.css";

import type { ReactNode } from "react";
// Protected Route Component
const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route index element={<WelcomeSection />} />
            <Route path="clients" element={<ClientesPage />} />
            <Route path="products" element={<ProductosPage />} />
            <Route path="categories" element={<CategoriasPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
