import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { CButton } from "@/components/CButton";
import { Logo } from "@/components/SiteLogo";
import ThemeToggle from "@/components/ThemeToggle";
import useServerStore from "@/stores/ServerStore";
import { useNavigate } from "react-router-dom";
import { IconRefresh } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";

function Servers() {
  const navigate = useNavigate();

  const { session, signOut } = useAuth();

  const { servers, refreshServers, addServer } = useServerStore();

  useEffect(() => {
    refreshServers();
  }, [refreshServers]);

  const handleLogout = async () => {
    await signOut();
  };

  const [form, setForm] = useState({
    name: "",
    type: "VANILLA",
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
        <IconRefresh className="cursor-pointer" onClick={refreshServers} />
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
        <p className="text-xl">Add New</p>

        <Input
          placeholder="Server Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          placeholder="Server Type"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        />
        <Input
          placeholder="Server Version"
          value={form.version}
          onChange={(e) => setForm({ ...form, version: e.target.value })}
        />
        <CButton onClick={handleAddServer}>Create</CButton>
        {formError}
      </div>
    </div>
  );
}

export default Servers;
