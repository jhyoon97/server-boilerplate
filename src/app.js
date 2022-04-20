import initEnv from "config/env";
import express from "express";
import cors from "cors";
import bearerToken from "express-bearer-token";
import cacheController from "express-cache-controller";
import http from "http";
import morgan from "morgan";
import chalk from "chalk";
import dayjs from "dayjs";

// router
import router from "route";

// configuring
initEnv();

const { APP_PORT } = process.env;
const app = express();

// REQUEST LOGGING
morgan.token("customDate", () => dayjs().format("YYYY-MM-DD HH:mm:ss"));
const morganChalk = morgan(
  (tokens, req, res) => {
    const methodColor = (() => {
      switch (req.method) {
        case "GET":
          return "bgGreen";
        case "POST":
          return "bgYellow";
        case "DELETE":
          return "bgRed";
        case "PATCH":
          return "bgCyan";
        case "PUT":
          return "bgWhite";
        default:
          return "bgWhite";
      }
    })();
    const statusColor = (() => {
      const status = Math.floor(parseInt(tokens.status(req, res), 10) / 100);

      switch (status) {
        case 2:
          return "green";
        case 3:
          return "blue";
        case 4:
          return "yellow";
        case 5:
          return "red";
        default:
          return "white";
      }
    })();

    return [
      tokens.customDate(), // date
      chalk[methodColor].black(tokens.method(req, res)), // http method
      tokens.url(req, res), // uri
      chalk[statusColor](tokens.status(req, res)), // response status
    ].join(" ");
  } /* 
    {
      skip: (req, res) => {
        return req.method === 'OPTIONS';
      },
    } */
);

app.use(morganChalk);
app.use(cors());
app.use(bearerToken());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cacheController({
    maxAge: 0,
    noCache: true,
  })
);
app.use(router);
app.use((err, req, res, next) => {
  // 컨트롤러에서 에러 발생시 처리
  console.log(err);
  return res.status(err.code || 500).json({
    message: err.message,
    type: err.type || "INTERNAL_SERVER_ERROR",
    reason: err.reason,
    payload: err.payload,
  });
});

const server = http.createServer(app);

server.listen(APP_PORT, "0.0.0.0", () => {
  console.log(`[SERVER] running on ${APP_PORT}`);
});
server.setTimeout(60 * 30 * 1000);
