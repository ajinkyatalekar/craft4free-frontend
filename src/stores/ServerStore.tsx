import { create } from "zustand";
import supabase from "@/utils/supabase";

import { Tables } from "@/../database.types";
import { components } from "@/../api.types";
import { API_URL } from "@/utils/server";

type Server = Tables<"servers">;

type ServerCreationReq = components["schemas"]["ServerCreationReq"];
type ServerCreationResp = components["schemas"]["ServerCreationResp"];

interface ServerState {
  servers: Server[];
  isLoading: boolean;
  error: string | null;
  addServer: (
    serverData: ServerCreationReq,
    token: string,
  ) => Promise<ServerCreationResp>;
  refreshServers: () => Promise<void>;
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

  refreshServers: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from("servers").select("*");

      if (error) {
        throw new Error(error.message);
      }

      set({
        servers: data as Server[],
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
      // Access servers from the state, not from an undefined variable
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
      return null; // Make sure to return null for the error case
    }
  },
}));

export default useServerStore;
