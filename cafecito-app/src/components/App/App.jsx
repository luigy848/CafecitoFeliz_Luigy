import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../../context/AuthContext";
import { CartProvider } from "../../context/CartContext";
import Layout from "../../layout/Layout";
import ProtectedRoute from "../../pages/ProtectedRoute";
import Login from "../../pages/Login";
import Sale from "../../pages/Sale";
import Receipt from "../../pages/Receipt";
import Sales from "../../pages/Sales";
import Customers from "../../pages/Customers";
import AdminProducts from "../../pages/AdminProducts";
import AdminRewards from "../../pages/AdminRewards";
import AdminUsers from "../../pages/AdminUsers";
import NotFound from "../../pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Sale />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recibo/:saleId"
                element={
                  <ProtectedRoute>
                    <Receipt />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ventas"
                element={
                  <ProtectedRoute>
                    <Sales />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clientes"
                element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/productos"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/lealtad"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminRewards />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/cuentas"
                element={
                  <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
