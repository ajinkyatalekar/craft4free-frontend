import { Tables } from "@/../database.types";

export type Server = Tables<"servers">;
export type FullServer = {
  server: Server;
  running: boolean;
  url: string;
};
