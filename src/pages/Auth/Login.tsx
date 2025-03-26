import ThemeToggle from "@/components/ThemeToggle";
import { Logo } from "@/components/SiteLogo";
import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { CButton } from "@/components/CButton";

import { useNavigate } from "react-router-dom";

function Login() {
  const { signIn, signInWithGoogle, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // email: "test@gmail.com",
    // password: "password",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      await signIn(formData.email, formData.password);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleGoogleOAuth = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-2 max-w-sm m-20">
      <ThemeToggle />
      <Logo />
      <div className="mt-5" />

      <p className="text-xl">Welcome to Craft4Free.com</p>
      <CButton
        onClick={() => {
          handleRegisterRedirect();
        }}
        className="cursor-pointer"
        disabled={loading}
      >
        Register
      </CButton>
      <p>Or</p>

      <div className="flex flex-col gap-4">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
        />
        <CButton
          onClick={() => {
            handleLogin();
          }}
          className="cursor-pointer"
          disabled={loading}
        >
          Login
        </CButton>
      </div>

      <p>Or</p>

      <CButton
        onClick={() => {
          handleGoogleOAuth();
        }}
        className="cursor-pointer"
        disabled={loading}
      >
        Continue with Google
      </CButton>

      <p>{error}</p>
    </div>
  );
}

export default Login;
