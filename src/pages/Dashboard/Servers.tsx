import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import useServerStore from "@/stores/ServerStore";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { toast } from "sonner";
import {
  RefreshCcw,
  MoreVertical,
  Plus,
  Trash,
  Copy,
  Server,
} from "lucide-react";

import { Tables } from "@/../database.types";
import { API_URL } from "@/utils/server";
import { components } from "@/../api.types";
import { CreateServerDialog } from "@/components/Dashboard/CreateServerDialog";
type Server = Tables<"servers">;
type ServerStartReq = components["schemas"]["ServerStartReq"];
type ServerStartResp = components["schemas"]["ServerStartResp"];

function Servers() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { servers, refreshServers } = useServerStore();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    refreshServers();
  }, [refreshServers, session]);

  const handleDeleteServer = async (serverId: string, serverName: string) => {
    if (!serverId) return;
    const body: ServerStartReq = { server_id: serverId };
    try {
      const response = await fetch(`${API_URL}/server/${serverId}/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify(body),
      });

      const result: ServerStartResp = await response.json();

      console.log(result);
      if (result.data) {
        refreshServers();
        toast.success("Server Deleted", {
          description: `${serverName} was successfully deleted.`,
        });
      } else {
        toast.error("Error Deleting Server", {
          description: result.error?.message || "An unknown error occurred",
        });
      }

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleCopyServer = (server: Server) => {
    console.log("Copying", server.name);
    setCreateDialogOpen(true);
  };

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-10 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl">Your Servers</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshServers}
            title="Refresh servers"
            className="cursor-pointer"
          >
            <RefreshCcw className="h-5 w-5" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.map((server) => (
            <Card key={server.id} className="overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl">{server.name}</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleCopyServer(server)}
                      className="cursor-pointer"
                      disabled
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy</span>
                    </DropdownMenuItem>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                          onSelect={(e) => e.preventDefault()}
                          className="cursor-pointer"
                        >
                          <Trash className="mr-2 h-4 w-4 text-red-400" />
                          <span className="text-red-400">Delete</span>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Server</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete {server.name}? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="cursor-pointer"
                            onClick={() =>
                              handleDeleteServer(server.id, server.name)
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1 text-sm text-muted-foreground pt-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Type:</span> {server.type}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Version:</span>{" "}
                    {server.version}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  onClick={() => navigate(`/servers/${server.id}`)}
                >
                  Manage Server
                </Button>
              </CardFooter>
            </Card>
          ))}

          {/* Create New Server Card */}
          {servers.length != 0 && (
            <Card
              className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:bg-gray-800 transition-colors sm:bg-gray-900 sm:bg-[url(assets/background/caves.png)] bg-blend-overlay bg-cover"
              onClick={() => setCreateDialogOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-3 rounded-full bg-primary/10 mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <p className="text-xl font-medium text-center">
                  Create New Server
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {servers.length === 0 && !createDialogOpen && (
          <div className="flex flex-col items-center justify-center pt-40 text-center">
            <div className="rounded-full p-6 bg-muted">
              <Server className="h-12 w-12 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No servers found</h2>
            <p className="mt-2 text-muted-foreground">
              You don't have any servers yet. Create your first server now!
            </p>
            <Button
              className="mt-6 cursor-pointer"
              onClick={() => setCreateDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create Server
            </Button>
          </div>
        )}

        {/* Create Server Dialog */}
        <CreateServerDialog
          createDialogOpen={createDialogOpen}
          setCreateDialogOpen={setCreateDialogOpen}
        />
      </div>
    </>
  );
}

export default Servers;
