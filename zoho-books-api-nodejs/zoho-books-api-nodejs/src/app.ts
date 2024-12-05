// src/app.ts
import express from "express";
import cors from "cors";
import config from "./config";
import zohoRoutes from "./routes/zoho.routes";
import tokenRoutes from "./routes/token.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes with API prefix
const apiRouter = express.Router();
apiRouter.use("/zoho", zohoRoutes);
apiRouter.use("/token", tokenRoutes);

app.use("/api", apiRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something broke!" });
  }
);

// Start server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

export default app;
