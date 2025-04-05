import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SiteHeader } from "@/components/SiteHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Power, RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import { FullServer } from "@/types/server";
import { ServerStatus } from "@/components/Dashboard/ServerStatus";
import { Skeleton } from "@/components/ui/skeleton";
import Console from "@/components/Dashboard/Console";

import useServerStore from "@/stores/ServerStore";

function ServerPanel() {
  const { server_id } = useParams();
  const { session } = useAuth();
  const { fetch_server, start_server, stop_server } = useServerStore();

  const [isLoading, setIsLoading] = useState(false);
  const [server, setServer] = useState<FullServer | null>(null);

  const handleFetch = async () => {
    if (!server_id) return;

    const response = await fetch_server(server_id, session?.access_token || "");
    if (response.success) {
      setServer(response.data as FullServer);
    } else {
      toast.error(response.error);
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
    setIsLoading(true);

    const result = await start_server(server_id, session?.access_token || "");

    if (result.success) {
      await handleFetch();
      toast.success("Server started successfully");
    } else {
      toast.error(result.error);
    }

    setIsLoading(false);
  };

  const handleStop = async () => {
    if (!server_id) return;
    setIsLoading(true);

    const result = await stop_server(server_id, session?.access_token || "");

    if (result.success) {
      await handleFetch();
      toast.success("Server stopped successfully");
    } else {
      toast.error(result.error);
    }

    setIsLoading(false);
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
