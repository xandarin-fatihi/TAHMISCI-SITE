"use strict";

const { app, prepareRuntime, startServer, store } = require("./app");

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { app, prepareRuntime, startServer, store };
