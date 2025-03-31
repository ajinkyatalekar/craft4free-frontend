import { create } from "zustand";
import supabase from "@/utils/supabase";

import { components } from "@/../api.types";
import { API_URL } from "@/utils/server";
import { FullServer, Server } from "@/types/server";

type ServerCreationReq = components["schemas"]["ServerCreationReq"];
type ServerCreationResp = components["schemas"]["ServerCreationResp"];

interface ServerState {
  servers: FullServer[];
  isLoading: boolean;
  error: string | null;
  addServer: (
    serverData: ServerCreationReq,
    token: string,
  ) => Promise<ServerCreationResp>;
  refreshServers: (token: string) => Promise<void>;
  getServer: (server_id: string) => Promise<Server | null>;
}

const useServerStore = create<ServerState>((set) => ({
  servers: [],
  isLoading: false,
  error: null,

  addServer: async (serverData: ServerCreationReq, token: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/server`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(serverData),
      });

      const result: ServerCreationResp = await response.json();

      if (result.success && result.data) {
        set({
          isLoading: false,
          error: "",
        });
      } else {
        set({
          isLoading: false,
          error: result.error?.message || "Unknown error occurred",
        });
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create server";
      set({ isLoading: false, error: errorMessage });
      return {
        success: false,
        error: {
          type: "NETWORK_ERROR",
          message: errorMessage,
        },
      };
    }
  },

  refreshServers: async (token: string) => {
    set({ isLoading: true });
    try {
      const response = await fetch(`${API_URL}/server`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);

      if (!data.success) {
        throw new Error(data.error);
      }

      set({
        servers: data.data as FullServer[],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to refresh servers";
      set({
        isLoading: false,
        error: errorMessage,
      });
    }
  },

  getServer: async (server_id: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from("servers")
        .select("*")
        .eq("id", server_id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      set({ isLoading: false, error: null });
      return data as Server;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to get server";
      set({
        isLoading: false,
        error: errorMessage,
      });
      return null;
    }
  },
}));

export default useServerStore;
