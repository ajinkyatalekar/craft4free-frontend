import { useNavigate } from "react-router-dom";

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

import { MoreVertical, Trash, Copy } from "lucide-react";

import { Tables } from "@/../database.types";
type Server = Tables<"servers">;

export function ServerCard({
  server,
  handleCopyServer,
  handleDeleteServer,
}: {
  server: Server;
  handleCopyServer: (server: Server) => void;
  handleDeleteServer: (serverId: string, serverName: string) => void;
}) {
  const navigate = useNavigate();
  return (
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
                    Are you sure you want to delete {server.name}? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="cursor-pointer"
                    onClick={() => handleDeleteServer(server.id, server.name)}
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
            <span className="font-semibold">Version:</span> {server.version}
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
  );
}
