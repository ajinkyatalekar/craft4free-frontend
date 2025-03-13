import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Landing from "@/pages/Landing";
import Servers from "@/pages/Dashboard/Servers";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  return !user && !loading ? <Navigate to="/" replace /> : <Outlet />;
};

const AuthLayout = () => {
  const { user } = useAuth();

  return user ? <Navigate to="/servers" replace /> : <Outlet />;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/servers" element={<Servers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
