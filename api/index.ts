
import { app } from "../src/app";
import { createServer } from "http";

const server = createServer(app);

export default function handler(req: any, res: any) {
  server.emit("request", req, res);
}
