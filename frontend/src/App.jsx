import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ToastProvider from "./components/ToastProvider";
import ErrorBoundary from "./components/ErrorBoundary";

import AppLayout from "./components/AppLayout";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminStores from "./pages/admin/AdminStores";
import AdminUsers from "./pages/admin/AdminUsers";

import UserStores from "./pages/user/UserStores";
import UserProfile from "./pages/user/UserProfile";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerProfile from "./pages/owner/OwnerProfile";

function Protected({ children }) {
  const { user, booting } = useAuth();
  if (booting) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ role, children }) {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

function HomeRedirect() {
  const { user, booting } = useAuth();
  if (booting) return <div className="p-6">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
  if (user.role === "OWNER") return <Navigate to="/owner" replace />;
  return <Navigate to="/user" replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomeRedirect />} />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* ADMIN */}
              <Route
                path="/admin"
                element={
                  <Protected>
                    <RoleRoute role="ADMIN">
                      <AppLayout />
                    </RoleRoute>
                  </Protected>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="stores" element={<AdminStores />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              {/* USER */}
              <Route
                path="/user"
                element={
                  <Protected>
                    <RoleRoute role="USER">
                      <AppLayout />
                    </RoleRoute>
                  </Protected>
                }
              >
                <Route index element={<UserStores />} />
                <Route path="profile" element={<UserProfile />} />
              </Route>

              {/* OWNER */}
              <Route
                path="/owner"
                element={
                  <Protected>
                    <RoleRoute role="OWNER">
                      <AppLayout />
                    </RoleRoute>
                  </Protected>
                }
              >
                <Route index element={<OwnerDashboard />} />
                <Route path="profile" element={<OwnerProfile />} />
              </Route>

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
