import localConfig from "./default";
import devConfig from "./dev";
import prodConfig from "./prod";

const config = () => {
  process.env.NODE_ENV = "production";
  switch (process.env.NODE_ENV) {
    case "default":
      return localConfig;
    case "dev":
      return devConfig;
    case "production":
      return prodConfig;
    default:
      throw new Error("Config variables not set");
  }
};
export default config();
