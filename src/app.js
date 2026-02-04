// @ts-check
import express from "express";
import { log } from '@dwtechs/winstan';
import { endTimer, startTimer } from "@dwtechs/winstan-plugin-express-perf";
import { listen } from "@dwtechs/servpico-express";
import { errorHandler } from "@dwtechs/errandler-express";
import healixRouter from "@dwtechs/healix-express";
import helmet from "helmet";
import { helmetConfig } from "./config/helmet.js";

const app = express();
app.use(helmet(helmetConfig));
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

import consumerSvc from "./services/consumer.js";
import routeSvc from "./services/route.js";

// middlewares
import { send } from "./middlewares/res/send.js";
import checkRoute from "./middlewares/validators/check-route.js";
import { checkRequest } from "./middlewares/validators/check-request.js"; // Authenticate request and load consumer session

// Routes
import consumer from "./routes/consumer.js";
import proxy from "./routes/proxy.js";
import route from "./routes/route.js";

app.use(express.json());
app.use("/health", healixRouter);
// performance measurement starts for any call to the following routes
app.use(startTimer);
// Validate route
app.use(checkRoute);
// Routes
app.use("/consumers", consumer);
app.use("/routes", ...checkRequest, route, send);
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
