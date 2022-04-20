import path from "path";
import dotenv from "dotenv";
import fs from "fs";

export default () => {
  switch (process.env.NODE_ENV) {
    case "local":
    case "develop":
    case "production": {
      const envConfig = dotenv.parse(
        fs.readFileSync(path.join(__dirname, `./.env.${process.env.NODE_ENV}`))
      );

      for (const key of Object.keys(envConfig)) {
        process.env[key] = envConfig[key];
      }
      console.log("[ENV] SET");
      break;
    }
    default:
      console.error("오류로 인해 process.env.NODE_ENV를 설정하지 못했습니다!");
  }
};
