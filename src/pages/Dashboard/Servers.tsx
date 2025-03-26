import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CButton } from "@/components/CButton";
import { Logo } from "@/components/SiteLogo";
import ThemeToggle from "@/components/ThemeToggle";
import useServerStore from "@/stores/ServerStore";
import { useNavigate } from "react-router-dom";
import { IconRefresh } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Servers() {
  const navigate = useNavigate();

  const { session, signOut } = useAuth();

  const { servers, refreshServers, addServer } = useServerStore();

  useEffect(() => {
    refreshServers();
    console.log(session?.access_token);
  }, [refreshServers, session]);

  const handleLogout = async () => {
    await signOut();
  };

  const [form, setForm] = useState({
    name: "",
    type: "PAPER",
    version: "1.21.4",
  });
  const [formError, setFormError] = useState("");

  const handleAddServer = async () => {
    if (!session?.access_token) {
      setFormError("Not authenticated");
      return;
    }

    const result = await addServer(
      {
        name: form.name,
        type: form.type,
        version: form.version,
      },
      session?.access_token,
    );
    if (result.success) {
      console.log(result.data);
      refreshServers();
      setFormError("Added server successfully");
    } else {
      setFormError("Error: " + result.error?.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 max-w-sm m-20">
      <ThemeToggle />
      <div className="flex flex-row gap-2 items-center">
        <Logo />
        <CButton
          onClick={() => {
            handleLogout();
          }}
        >
          Logout
        </CButton>
      </div>

      <div className="mt-5" />

      <div className="flex flex-row gap-2 items-center">
        <p className="text-xl">Your servers</p>
        <IconRefresh
          className="cursor-pointer active:scale-90 transition-transform duration-150"
          onClick={refreshServers}
        />
      </div>
      <p>{servers.length == 0 && "You don't have any servers."}</p>
      {servers.map((server) => (
        <CButton
          key={server.id}
          onClick={() => navigate(`/servers/${server.id}`)}
        >
          {server.name}
        </CButton>
      ))}

      <div className="mt-5" />

      <div className="flex flex-col gap-2">
        <p className="text-xl">Add New Server</p>

        <Label htmlFor="name">Server Name</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Label htmlFor="type">Server Type</Label>
        <Input
          id="type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          disabled
        />
        <Label htmlFor="version">Server Version</Label>
        <Input
          id="version"
          value={form.version}
          onChange={(e) => setForm({ ...form, version: e.target.value })}
          disabled
        />
        <CButton onClick={handleAddServer}>Create</CButton>
        {formError}
      </div>
    </div>
  );
}

export default Servers;
