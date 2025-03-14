import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tables } from "@/../database.types";
import { useServer } from "@/context/ServerContext";
import { CButton } from "@/components/CButton";
import { useAuth } from "@/context/AuthContext";
import { components } from "@/../api.types";
import { useNavigate } from "react-router-dom";
import { IconX } from "@tabler/icons-react";

type Server = Tables<"servers">;

function ServerPanel() {
  const { server_id } = useParams();
  const [server, setServer] = useState<Server | null>(null);
  const { getServer } = useServer();

  const { session } = useAuth();

  const [status, setStatus] = useState("Stopped...");

  const navigate = useNavigate();

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

  type ServerStartReq = components["schemas"]["ServerStartReq"];
  type ServerStartResp = components["schemas"]["ServerStartResp"];

  const handleStart = async () => {
    if (!server_id) return;
    const body: ServerStartReq = { server_id: server_id };
    try {
      const response = await fetch(
        `http://129.213.144.81:8000/server/${server_id}/start`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const result: ServerStartResp = await response.json();

      if (result.success && result.data) {
        console.log(result.data);
      } else {
        console.log(result.error?.message);
      }

      setStatus(
        `Running on ${result.data?.url} (It may take upto 2 minutes to start)`,
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleStop = async () => {
    if (!server_id) return;
    const body: ServerStartReq = { server_id: server_id };
    try {
      const response = await fetch(
        `http://129.213.144.81:8000/server/${server_id}/stop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const result: ServerStartResp = await response.json();

      setStatus(`Stopped...`);

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!server_id) return;
    const body: ServerStartReq = { server_id: server_id };
    try {
      const response = await fetch(
        `http://129.213.144.81:8000/server/${server_id}/delete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.access_token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const result: ServerStartResp = await response.json();
      navigate("/servers");
      setStatus(`Stopped...`);

      return result;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-sm m-20">
      <CButton onClick={() => navigate("/servers")}>
        Go back to all servers
      </CButton>
      <div className="flex flex-row gap-2 items-center">
        <p className="text-2xl">{server?.name}</p>
        <IconX size={14} className="cursor-pointer" onClick={handleDelete} />
      </div>
      <p>
        {server?.type} {server?.version}
      </p>
      <div className="flex flex-row gap-2">
        <CButton onClick={handleStart}>Start</CButton>
        <CButton onClick={handleStop}>Stop</CButton>
      </div>

      <p>Status: {status}</p>
    </div>
  );
}

export default ServerPanel;
