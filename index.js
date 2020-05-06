const express = require("express");

const router = require("./data/post-router");

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.json({ query: req.query, params: req.params, headers: req.headers });
  });

  server.use("/api/posts", router);

  server.listen(4000, () => {
      console.log("\n Server running! \n");
  })