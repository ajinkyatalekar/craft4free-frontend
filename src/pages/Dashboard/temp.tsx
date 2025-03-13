import { CButton } from "@/components/CButton";
import { Logo } from "@/components/SiteLogo";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { createServer } from "@/services/api";
import { useEffect, useState } from "react";

function Dashboard() {
  const { session, signOut } = useAuth();

  const [name, setName] = useState("");

  const handleLogout = async () => {
    await signOut();
  };

  const handleCreateServer = async () => {
    if (session?.access_token) {
      const response = await createServer(name, session?.access_token);
      console.log(response);
    }
  };

  useEffect(() => {
    console.log(session?.access_token);
  }, [session]);

  return (
    <div className="flex flex-col gap-2 max-w-sm m-20">
      <ThemeToggle />
      <Logo />
      <CButton
        onClick={() => {
          handleLogout();
        }}
      >
        Logout
      </CButton>

      <div className="mt-5" />

      <Input
        placeholder="server name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></Input>

      <Button
        onClick={() => {
          handleCreateServer();
        }}
      >
        Create Server
      </Button>
    </div>
  );
}

export default Dashboard;
