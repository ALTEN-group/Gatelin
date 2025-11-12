// @ts-check
import express from "express";
// const cors = require("cors");
import { log } from '@dwtechs/winstan';
import { endTimer, startTimer } from "@dwtechs/winstan-plugin-express-perf";
import { listen } from "@dwtechs/servpico-express";
import { errorHandler } from "@dwtechs/errandler-express";
import helmet from "helmet";

const app = express();
app.use(helmet());
app.disable("x-powered-by");


// const { CORS, METHODS } = process.env;
// const whitelist = [CORS]
// const corsOptions = {
//   origin: (origin, callback) => {
//     if (whitelist.indexOf(origin) !== -1)
//       callback(null, true)
//     else
//       callback(new Error('Not allowed by CORS'))
//   },
//   methods: METHODS, // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
// };

// app.use(cors('*',corsOptions));

// Mandatory modules for any service
import health from "health";
import prom from "prom";

import consumerSvc from "./services/consumer";
import routeSvc from "./services/route";

// middlewares
import res from "./middlewares/res";
import checkRoute from "./middlewares/validators/check-route";

// Routes
import consumer from "./routes/consumer";
import proxy from "./routes/proxy";
import route from "./routes/route";

app.use(express.json());
app.use("/metrics", prom);
app.use("/health", health);
// performance measurement starts for any call to the following routes
app.use(startTimer);
// Validate route
app.use(checkRoute);
// Routes
app.use("/consumers", consumer, res.send);
app.use("/routes", route, res.send);
app.use("/", proxy);

// Performance measurement ends
app.use(endTimer);

// Error handling
errorHandler(app);

// Init reference data
Promise.all([
    routeSvc.init(), 
    consumerSvc.init(),
  ])
  .then(() => listen(app))
  .catch((err) => log.error(`App cannot start: ${err.msg}`));
