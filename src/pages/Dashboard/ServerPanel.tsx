import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tables } from "@/../database.types";
import { useServer } from "@/context/ServerContext";
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
  const [server, setServer] = useState<Server | null>(null);
  const { getServer } = useServer();

  const { session } = useAuth();

  const [status, setStatus] = useState("Stopped");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!server_id) return;

    const fetchServer = async () => {
      try {
        const serverData = await getServer(server_id);
        setServer(serverData);
      } catch (error) {
        console.error("Error fetching server:", error);
      }
    };

    fetchServer();
  }, [server_id, getServer]);

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
        setStatus("Running at " + result.data.url);
        setAddress(result.data.url);
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

      setStatus(`Stopped`);
      setAddress("");

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
            <p className="text-xl">{address}</p>
            <p className="text-lg text-muted-foreground">
              {server?.type} {server?.version}
            </p>
            <div className="mt-4" />
            <p className="text-lg">Status: {status}</p>
            <div className="mt-4" />
            <Button
              className="cursor-pointer"
              onClick={status === "Stopped" ? handleStart : handleStop}
              disabled={isLoading}
            >
              <Power /> {status === "Stopped" ? "Start Server" : "Stop Server"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default ServerPanel;
