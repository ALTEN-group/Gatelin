import express from "express";
import helmet from "helmet";
import healixRouter from "@dwtechs/healix-express";
import { listen } from "@dwtechs/servpico-express";
import { log } from "@dwtechs/winstan";
import { mockRoles } from "./data/roles.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use("/roles/health", healixRouter);

// POST /roles/search/ - Search for roles
app.post("/roles/roles/search/", (req, res) => {
  log.info("POST /roles/roles/search/ - Search roles");

  res.status(200).json({
    rows: mockRoles,
    total: mockRoles.length,
  });
});

listen(app);
