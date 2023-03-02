// *********************************************** BOOKS RELATED ENDPOINTS ******************************************

/* ************************************************* BOOKS CRUD ENDPOINTS *******************************************

1. CREATE --> POST http://localhost:3001/books/ (+ body)
2. READ --> GET http://localhost:3001/books/ (+ optional query search params)
3. READ (single book) --> GET http://localhost:3001/books/:bookId
4. UPDATE (single book) --> PUT http://localhost:3001/books/:bookId (+ body)
5. DELETE (single book) --> DELETE http://localhost:3001/books/:bookId

*/

import Express from "express"; // 3RD PARTY MODULE (npm i express)
import uniqid from "uniqid";
import createHttpError from "http-errors";
import { checkBlogsSchema, triggerBadRequest } from "./validation.js";
import { getBlogs, writeBlogs } from "../../lib/fs-tools.js";

const blogsRouter = Express.Router();

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

    const blogsArray = await getBlogs();
    blogsArray.push(newBlog);
    await writeBlogs(blogsArray);
    res.status(201).send(blogsArray);
  }
);

blogsRouter.get("/", async (req, res, next) => {
  try {
    // throw new Error("KABOOOOOOOOOOOOOOOOOOM!")
    const blogs = await getBlogs();
    res.send(blogs);
  } catch (error) {
    next(createHttpError(500, `Server side error`));
  }
});
blogsRouter.get("/search", async (req, res, next) => {
  try {
    // throw new Error("KABOOOOOOOOOOOOOOOOOOM!")
    const blogs = await getBlogs();
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
    const blogsArray = await getBlogs();

    const foundBlog = blogsArray.find((blog) => blog._id === req.params.blogId);
    if (foundBlog) {
      res.send(foundBlog);
    } else {
      // the blog has not been found, I'd like to trigger a 404 error
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
    const blogsArray = await getBlogs();

    const index = blogsArray.findIndex(
      (blog) => blog._id === req.params.blogId
    );
    if (index !== -1) {
      const oldBlog = blogsArray[index];
      const updatedBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };

      blogsArray[index] = updatedBlog;

      await writeBlogs(blogsArray);

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
    const blogsArray = await getBlogs();

    const remainingBlogs = blogsArray.filter(
      (blog) => blog._id !== req.params.blogId
    );

    if (blogsArray.length !== remainingBlogs.length) {
      await writeBlogs(remainingBlogs);
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

blogsRouter.post("/:blogId/comments", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();
    const foundBlog = blogsArray.find((blog) => blog._id === req.params.blogId);
    const { authorName, text } = req.body;
    console.log("comments", authorName, text);
    if (foundBlog) {
      if (!foundBlog.comments) {
        foundBlog.comments = [];
      }
      const newComment = {
        authorName,
        text,
      };
      console.log("newComment", newComment);
      foundBlog.comments.push(newComment);
      await writeBlogs(blogsArray);
      res.status(201).send(blogsArray);
    } else {
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      ); //
    }
  } catch (error) {
    next(error);
  }
});

blogsRouter.get("/:blogId/comments", async (req, res, next) => {
  try {
    const blogsArray = await getBlogs();

    const foundBlog = blogsArray.find((blog) => blog._id === req.params.blogId);
    if (foundBlog) {
      res.send(foundBlog);
    } else {
      // the blog has not been found, I'd like to trigger a 404 error
      next(
        createHttpError(404, `Blog with id ${req.params.blogId} not found!`)
      ); // this jumps to the error handlers
    }
  } catch (error) {
    next(error); // This error does not have a status code, it should trigger a 500
  }
});

export default blogsRouter;
