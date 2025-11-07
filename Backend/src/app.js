import express from "express";
import routesLiveSession from "./routes/liveSession.routes.js";
import cors from "cors";
const app = express();

app.use(cors())
app.use(express.json());

app.use("/live-session", routesLiveSession);

export default app;
