import Express from "express";
import multer from "multer";
import { extname } from "path";
import { saveAuthorsAvatars, saveBlogPostsCover } from "../../lib/fs-tools.js";

const filesRouter = Express.Router();

filesRouter.post(
  "/:authorId/uploadAvatar",
  multer().single("avatar"),
  async (req, res, next) => {
    // "avatar" here needs to match exactly to the name of the field appended to the FormData object in the FE (or in Postman req body)
    // If they do not match, multer will not find any file
    try {
      console.log("FILE:", req.file);
      //   console.log("BODY:", req.body);
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.authorId + originalFileExtension;
      await saveAuthorsAvatars(fileName, req.file.buffer);
      // Add an avatar field to the corresponding author in authors.json file, containing `http://localhost:3001/img/authors/${filename}`
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);
filesRouter.post(
  "/:blogId/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    // "avatar" here needs to match exactly to the name of the field appended to the FormData object in the FE (or in Postman req body)
    // If they do not match, multer will not find any file
    try {
      console.log("FILE:", req.file);
      //   console.log("BODY:", req.body);
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.blogId + originalFileExtension;
      await saveBlogPostsCover(fileName, req.file.buffer);
      // Add an avatar field to the corresponding blog in blogs.json file, containing `http://localhost:3001/img/blogPosts/${filename}`
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

export default filesRouter;
