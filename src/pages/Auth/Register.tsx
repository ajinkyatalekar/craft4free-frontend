import { useAuth } from "@/context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Logo } from "@/components/SiteLogo";

function Register() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle, error, clearError } = useAuth();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    setLoading(true);
    try {
      await signUp(formData.email, formData.password);
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

  const handleLoginNavigate = () => {
    clearError();
    navigate("/login");
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10 bg-gray-700 bg-[url(assets/background/pandas.png)] bg-right-bottom bg-blend-soft-light">
      <div className="flex w-full max-w-sm flex-col gap-3">
        <a
          onClick={() => navigate("/")}
          className="flex items-center gap-4 self-center font-medium cursor-pointer p-2 rounded-md"
        >
          <Logo />
        </a>

        <div className="flex flex-col gap-3">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Register</CardTitle>
              <CardDescription>
                Welcome! Create an account to get started.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex flex-col gap-4">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => {
                      handleGoogleOAuth();
                    }}
                    disabled={loading}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                    Login with Google
                  </Button>
                </div>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>
                {/* <form> */}
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required
                    />
                  </div>
                  <Button
                    // type="submit"
                    className="w-full cursor-pointer"
                    onClick={() => {
                      handleRegister();
                    }}
                    disabled={loading}
                  >
                    Register
                  </Button>
                </div>
                {/* </form> */}
                <div className="text-center text-sm">
                  Already have an account?{" "}
                  <a
                    onClick={() => handleLoginNavigate()}
                    className="underline underline-offset-4 cursor-pointer"
                  >
                    Sign in
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="text-red-400 text-center text-sm text-balance">
            {error}
          </div>

          {/* <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Register;
