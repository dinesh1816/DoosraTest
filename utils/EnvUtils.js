export const isLocal = () => process.env.NODE_ENV === "default";

export const isDev = () => process.env.NODE_ENV === "dev";

export const isProd = () => process.env.NODE_ENV === "production";
