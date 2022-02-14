module.exports = {
  apps: [
    {
      name: "user-local",
      script: "./bin/server.js",
      exec_mode: "fork",
      watch: true,
      env: {
        NODE_ENV: "default",
      },
      time: true,
    },
    {
      name: "user-dev",
      script: "./bin/server.js",
      exec_mode: "cluster",
      instances: 0,
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: "dev",
      },
      time: true,
    },
    {
      name: "user",
      script: "./bin/server.js",
      exec_mode: "cluster",
      instances: 0,
      exp_backoff_restart_delay: 100,
      env: {
        NODE_ENV: "production",
      },
      time: true,
    },
  ],
};
