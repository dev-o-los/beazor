import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import homeRoutes from "./routes/homeRoutes.js";

export const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/health", (_, res) => {
  res.json({ ok: true });
});

app.use("/api", homeRoutes);
app.use(errorHandler);
