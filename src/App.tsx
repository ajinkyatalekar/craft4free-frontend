import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Auth from '@/pages/Auth/Auth';
import Dashboard from '@/pages/Dashboard/Dashboard';
import { useAuth } from '@/context/AuthContext';

const ProtectedLayout = () => {
  const { user } = useAuth();

  return !user ? <Navigate to="/" replace /> : <Outlet />;
};

const AuthLayout = () => {
  const { user } = useAuth();

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
            <Route path="/" element={<Auth />} />
        </Route>
        <Route element={<ProtectedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;