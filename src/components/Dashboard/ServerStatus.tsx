import { FullServer } from "@/types/server";
import { IconCopy } from "@tabler/icons-react";
import { toast } from "sonner";

export const ServerStatus = ({
  server,
  styles,
}: {
  server: FullServer | null;
  styles?: string;
}) => {
  return (
    <>
      <div className={`flex items-center gap-2 ${styles}`}>
        {server?.status.status === "running" && (
          <>
            <span className="text-green-400">
              Running at {server?.status.url}
            </span>
            <IconCopy
              size={14}
              className="cursor-pointer hover:text-gray-400 transition-colors -ml-1"
              onClick={() => {
                navigator.clipboard.writeText(server?.status.url || "");
                toast.success(
                  `Server ${server?.server.name}'s URL copied to clipboard`,
                );
              }}
            />
          </>
        )}
        {server?.status.status === "starting" && (
          <>
            <span className="text-orange-400">
              Starting at {server?.status.url}
            </span>
            <IconCopy
              size={14}
              className="cursor-pointer hover:text-gray-400 transition-colors -ml-1"
              onClick={() => {
                navigator.clipboard.writeText(server?.status.url || "");
                toast.success(
                  `Server ${server?.server.name}'s URL copied to clipboard`,
                );
              }}
            />
          </>
        )}
        {server?.status.status === "stopped" && (
          <>
            <span className="text-red-400">Not Running</span>
          </>
        )}
      </div>
    </>
  );
};
