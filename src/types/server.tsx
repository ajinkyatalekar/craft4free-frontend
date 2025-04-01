import { Tables } from "@/../database.types";

export type Server = Tables<"servers">;
export type FullServer = {
  server: Server;
  status: ServerStatus;
};

type ServerStatus = {
  error: string;
  status: string;
  port: string;
  url: string;
};
