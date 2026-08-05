import express from "express";
import helmet from "helmet";
import healixRouter from "@dwtechs/healix-express";
import { listen } from "@dwtechs/servpico-express";
import { log } from "@dwtechs/winstan";
import { isStringOfLength } from "@dwtechs/checkard";
import { compare } from "@dwtechs/passken-express";
import { mockCredentials } from "./data/credentials.js";

const app = express();

app.use(helmet());
app.use(express.json());
app.use("/auth/health", healixRouter);

// POST /auth/verify - Validate user credentials (used by Gatelin check-pwd middleware)
app.post("/auth/verify", async (req, res) => {
  log.debug(
    `POST /auth/verify - Full request body: ${JSON.stringify(req.body, null, 2)}`,
  );

  // Extract filters
  const userId = req.body.filters?.userId?.value;
  const pwd = req.body.filters?.pwd?.value;

  // Validate userId format
  if (!Number.isInteger(userId) || userId <= 0)
    return res.status(400).json({ error: "Invalid userId format" });

  // Validate pwd (min 1, max 255 characters)
  if (!isStringOfLength(pwd, 1, 255))
    return res.status(400).json({ error: "Invalid pwd format" });

  // Find credentials by userId only, let passken-express compare the password hash
  const credential = mockCredentials.find((c) => c.userId === userId);
  if (!credential)
    return res.status(401).json({ error: "Invalid credentials" });

  req.body.pwd = pwd;
  res.locals.rows = [{ pwdHash: credential.pwdHash }];
  await compare(req, res, (err) => {
    if (err) return res.status(err.statusCode).json({ error: err.message });
    log.debug(`POST /auth/verify - success: ${JSON.stringify(credential)}`);
    res.status(200).json({
      success: true,
      message: "Authentication successful",
    });
  });
});

listen(app);
