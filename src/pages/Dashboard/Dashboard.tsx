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
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-2 p-20">
      <Button
        onClick={() => {
          handleLogout();
        }}
      >
        Logout
      </Button>
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
