import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { components } from "@/../api.types";
import { API_URL } from "@/utils/server";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Power, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { FullServer } from "@/types/server";
import { ServerStatus } from "@/components/Dashboard/ServerStatus";
import { Skeleton } from "@/components/ui/skeleton";
import Console from "@/components/Dashboard/Console";

type ServerStartReq = components["schemas"]["ServerStartReq"];
type ServerStartResp = components["schemas"]["ServerStartResp"];

function ServerPanel() {
  const { server_id } = useParams();
  const { session } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [server, setServer] = useState<FullServer | null>(null);

  const handleFetch = async () => {
    if (!server_id) return;
    const body: ServerStartReq = { server_id: server_id };
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
      if (result.success) {
        setServer(result.data);
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const loop = async () => {
      if (!server_id || !session?.access_token) return;
      await handleFetch();
      setTimeout(() => {
        loop();
      }, 2000);
    };

    loop();
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
        await handleFetch();
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

      await handleFetch();

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
        {server ? (
          <Card>
            <CardHeader className="text-3xl -mb-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl">{server?.server.name}</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    handleFetch();
                    toast("Server refreshed");
                  }}
                  title="Refresh servers"
                  className="cursor-pointer"
                >
                  <RefreshCcw className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                {server?.server.type} {server?.server.version}
              </p>
              <div className="mt-4" />
              <ServerStatus server={server} styles="text-lg" />
              <div className="mt-4" />
              <Button
                className="cursor-pointer"
                onClick={
                  server?.status.status === "stopped" ? handleStart : handleStop
                }
                disabled={server?.status.status === "starting" || isLoading}
              >
                <Power />{" "}
                {server?.status.status === "stopped"
                  ? "Start Server"
                  : "Stop Server"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Skeleton className="h-50 w-full" />
          </>
        )}

        <div className="mt-4" />
        {server?.server.id && (
          <Console
            serverId={server?.server.id}
            stopped={server?.status.status === "stopped"}
          />
        )}
      </div>
    </>
  );
}

export default ServerPanel;
