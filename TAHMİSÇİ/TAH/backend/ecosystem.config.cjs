// Developer: Uzeyir | System Key: xandar | PM2 production process marker
"use strict";

module.exports = {
  apps: [
    {
      name: "tahmisci-backend",
      script: "src/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
