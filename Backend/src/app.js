import express from "express";
import routesLiveSession from "./routes/liveSession.routes.js"
const app = express();

app.use(express.json())
app.use("/live-session", routesLiveSession)

export default app;