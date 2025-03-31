import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tables } from "@/../database.types";
import { useAuth } from "@/context/AuthContext";
import { components } from "@/../api.types";
import { API_URL } from "@/utils/server";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Power } from "lucide-react";
import { toast } from "sonner";

type Server = Tables<"servers">;
type ServerStartReq = components["schemas"]["ServerStartReq"];
type ServerStartResp = components["schemas"]["ServerStartResp"];

function ServerPanel() {
  const { server_id } = useParams();
  const { session } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [server, setServer] = useState<Server | null>(null);
  const [serverStatus, setServerStatus] = useState({
    running: false,
    url: "",
  });

  const handleFetch = async () => {
    if (!server_id) return;
    const body: ServerStartReq = { server_id: server_id };
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/server/${server_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();
      setServer(result.data.server);
      if (result.data.running) {
        setServerStatus({
          running: result.data.running,
          url: result.data.url,
        });
      } else {
        setServerStatus({
          running: false,
          url: "",
        });
      }

      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!server_id || !session?.access_token) return;
    handleFetch();
  }, [session?.access_token]);

  const handleStart = async () => {
    if (!server_id) return;
    const body: ServerStartReq = { server_id: server_id };
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/server/${server_id}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(body),
      });

      const result: ServerStartResp = await response.json();

      if (result.success && result.data) {
        handleFetch();
        toast.success("Server started successfully");
      } else {
        toast.error("Failed to start server");
      }

      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    if (!server_id) return;
    const body: ServerStartReq = { server_id: server_id };
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/server/${server_id}/stop`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(body),
      });

      const result: ServerStartResp = await response.json();
      setServerStatus({ running: false, url: "" });
      toast.success("Server stopped successfully");

      return result;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SiteHeader />
      <div className="mx-auto lg:mx-10 xl:mx-20 py-10 px-4">
        <Card>
          <CardHeader className="text-3xl -mb-5">{server?.name}</CardHeader>
          <CardContent>
            <p className="text-xl">{serverStatus.url}</p>
            <p className="text-lg text-muted-foreground">
              {server?.type} {server?.version}
            </p>
            <div className="mt-4" />
            <p className="text-lg">
              Status:{" "}
              {serverStatus.running
                ? `Running! Connect at ${serverStatus.url}`
                : "Stopped"}
            </p>
            <div className="mt-4" />
            <Button
              className="cursor-pointer"
              onClick={serverStatus.running ? handleStop : handleStart}
              disabled={isLoading}
            >
              <Power /> {!serverStatus.running ? "Start Server" : "Stop Server"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ServerPanel;
