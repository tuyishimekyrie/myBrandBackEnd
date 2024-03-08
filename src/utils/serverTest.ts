// serverTest.ts

import express from "express";

function createServer() {
  const app = express();

//   app.get("/", (req, res) => {
//     res.status(200).send("Server is running");
//   });

  return app;
}

export default createServer;
