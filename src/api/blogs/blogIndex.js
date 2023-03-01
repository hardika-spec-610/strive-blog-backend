// *********************************************** BOOKS RELATED ENDPOINTS ******************************************

/* ************************************************* BOOKS CRUD ENDPOINTS *******************************************

1. CREATE --> POST http://localhost:3001/books/ (+ body)
2. READ --> GET http://localhost:3001/books/ (+ optional query search params)
3. READ (single book) --> GET http://localhost:3001/books/:bookId
4. UPDATE (single book) --> PUT http://localhost:3001/books/:bookId (+ body)
5. DELETE (single book) --> DELETE http://localhost:3001/books/:bookId

*/

import Express from "express"; // 3RD PARTY MODULE (npm i express)
import fs from "fs"; // CORE MODULE (no need to install it!!!!)
import { fileURLToPath } from "url"; // CORE MODULE
import { dirname, join } from "path"; // CORE MODULE
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBlogsSchema, triggerBadRequest } from "./validation.js";

const blogsRouter = Express.Router();

const bolgsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogs.json"
);
const getBlogs = () => JSON.parse(fs.readFileSync(bolgsJSONPath));
const writeBlogs = (blogsArray) =>
  fs.writeFileSync(bolgsJSONPath, JSON.stringify(blogsArray));

blogsRouter.post(
  "/",
  checkBlogsSchema,
  triggerBadRequest,
  async (req, res, next) => {
    const { category, title, cover, readTime, author, content } = req.body;
    const newBlog = {
      category,
      title,
      cover,
      readTime,
      author,
      content,
      _id: uniqid(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const blogsArray = getBlogs();
    blogsArray.push(newBlog);
    writeBlogs(blogsArray);
    res.status(201).send(blogsArray);
  }
);

blogsRouter.get("/", async (req, res, next) => {
  try {
    // throw new Error("KABOOOOOOOOOOOOOOOOOOM!")
    const blogs = getBlogs();
    // if (req.query && req.query.category) {
    //   const filteredBlogPost = blogs.filter(blog => blog.category === req.query.category)
    //   res.send(filteredBlogPost)
    // } else {
    //   res.send(blogs)
    // }
    res.send(blogs);
  } catch (error) {
    next(createHttpError(500, `Server side error`));
  }
});
blogsRouter.get("/search", async (req, res, next) => {
  try {
    // throw new Error("KABOOOOOOOOOOOOOOOOOOM!")
    const blogs = getBlogs();
    if (req.query && req.query.title) {
      const filteredBlogPost = blogs.filter(
        (blog) => blog.title === req.query.title
      );
      res.send(filteredBlogPost);
    } else {
      res.send(blogs);
    }
  } catch (error) {
    next(createHttpError(500, `Server side error`));
  }
});

blogsRouter.get("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = getBlogs();

    const foundBlog = blogsArray.find((blog) => blog._id === req.params.blogId);
    if (foundBlog) {
      res.send(foundBlog);
    } else {
      // the book has not been found, I'd like to trigger a 404 error
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      ); // this jumps to the error handlers
    }
  } catch (error) {
    next(error); // This error does not have a status code, it should trigger a 500
  }
});

blogsRouter.put("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = getBlogs();

    const index = blogsArray.findIndex(
      (blog) => blog._id === req.params.blogId
    );
    if (index !== -1) {
      const oldBlog = blogsArray[index];
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };

      blogsArray[index] = updatedBlog;

      writeBlogs(blogsArray);

      res.send(updatedBlog);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.delete("/:blogId", async (req, res, next) => {
  try {
    const blogsArray = getBlogs();

    const remainingBlogs = blogsArray.filter(
      (blog) => blog._id !== req.params.blogId
    );

    if (blogsArray.length !== remainingBlogs.length) {
      writeBlogs(remainingBlogs);
      res.status(204).send();
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      ); //
    }
  } catch (error) {
    next(error);
  }
});

export default blogsRouter;
