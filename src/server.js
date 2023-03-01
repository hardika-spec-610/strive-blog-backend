// const express = require("express") OLD IMPORT SYNTAX
import Express from "express"; // NEW IMPORT SYNTAX (We can use it only if we add "type": "module", to package.json)
import listEndpoints from "express-list-endpoints";
import authorsRouter from "./api/authors/index.js";
import cors from "cors";
import blogsRouter from "./api/blogs/blogIndex.js";

const server = Express();
const port = 3001;

// ************************** MIDDLEWARES *********************
const loggerMiddleware = (req, res, next) => {
  console.log(
    `Request method ${req.method} -- url ${req.url} -- ${new Date()}`
  );
  req.user = "Hardika";
  next();
};

server.use(cors());
server.use(loggerMiddleware);
server.use(Express.json()); // If you don't add this line BEFORE the endpoints all request bodies will be UNDEFINED!!!!!!!!!!!!!!!

// ************************** ENDPOINTS ***********************
server.use("/authors", authorsRouter);
server.use("/blogPosts", blogsRouter);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log(`Server is running on port ${port}`);
});

server.on("error", (error) =>
  console.log(`Server is not running due to: ${error}`)
);
