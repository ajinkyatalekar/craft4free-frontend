import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

function Auth() {
  const { user, signUp, signIn, loading, error } = useAuth();

  const handleRegister = async () => {
    await signUp("test@gmail.com", "password");
  };

  const handleLogin = async () => {
    await signIn("test@gmail.com", "password");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-2">
      <p>User: {user?.email}</p>
      <Button
        onClick={() => {
          handleRegister();
        }}
        disabled={loading}
      >
        Register
      </Button>
      <Button
        onClick={() => {
          handleLogin();
        }}
        disabled={loading}
      >
        Login
      </Button>
      <p>Errors: {error}</p>
    </div>
  );
}

export default Auth;
