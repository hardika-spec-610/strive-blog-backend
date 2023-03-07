import Express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveAuthorsAvatars,
  saveBlogPostsCover,
  getBlogs,
  writeBlogs,
  getAuthors,
  writeAuthors,
} from "../../lib/fs-tools.js";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { getPDFReadableStream } from "../../lib/pdf-tools.js";
import { pipeline } from "stream";

const filesRouter = Express.Router();

const apiUrl = process.env.FE_DEV_URL;

const cloudinaryUploaderAvatar = multer({
  storage: new CloudinaryStorage({
    cloudinary, // cloudinary is going to search for smth in .env vars called process.env.CLOUDINARY_URL
    params: {
      folder: "BlogPostAuthorImages/authors",
    },
  }),
}).single("avatar");
const cloudinaryUploaderCover = multer({
  storage: new CloudinaryStorage({
    cloudinary, // cloudinary is going to search for smth in .env vars called process.env.CLOUDINARY_URL
    params: {
      folder: "BlogPostCoverImages/blogPosts",
    },
  }),
}).single("cover");

filesRouter.post(
  "/:authorId/uploadAvatar",
  cloudinaryUploaderAvatar,
  async (req, res, next) => {
    // "avatar" here needs to match exactly to the name of the field appended to the FormData object in the FE (or in Postman req body)
    // If they do not match, multer will not find any file
    try {
      console.log("FILE:", req.file);
      //   console.log("BODY:", req.body);
      // const originalFileExtension = extname(req.file.originalname);
      // const fileName = req.params.authorId + originalFileExtension;
      // await saveAuthorsAvatars(fileName, req.file.buffer);
      // Add an avatar field to the corresponding author in authors.json file, containing `http://localhost:3001/img/authors/${filename}`
      const authorsArray = await getAuthors();
      const index = authorsArray.findIndex(
        (author) => author.id === req.params.authorId
      );
      const oldAuthor = authorsArray[index];
      const updatedAuthor = {
        ...oldAuthor,
        ...req.body,
        // avatar: `${apiUrl}/img/authors/${fileName}`,
        avatar: req.file.path,
        updatedAt: new Date(),
      };
      authorsArray[index] = updatedAuthor;
      await writeAuthors(authorsArray);
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);
filesRouter.post(
  "/:blogId/uploadCover",
  cloudinaryUploaderCover,
  async (req, res, next) => {
    // "avatar" here needs to match exactly to the name of the field appended to the FormData object in the FE (or in Postman req body)
    // If they do not match, multer will not find any file
    try {
      console.log("FILE:", req.file);
      // const originalFileExtension = extname(req.file.originalname);
      // console.log("originalFileExtension:", originalFileExtension);
      // const fileName = req.params.blogId + originalFileExtension;
      // await saveBlogPostsCover(fileName, req.file.buffer);
      // Add an avatar field to the corresponding blog in blogs.json file, containing `http://localhost:3001/img/blogPosts/${filename}`
      const blogpostsArray = await getBlogs();
      const index = blogpostsArray.findIndex(
        (blogpost) => blogpost._id === req.params.blogId
      );
      if (index === -1) {
        res
          .status(404)
          .send({ message: `Blog with ${req.params.blogId} is not found!` });
        return;
      }
      const oldBlogpost = blogpostsArray[index];
      const updatedBlogpost = {
        ...oldBlogpost,
        ...req.body,
        // cover: `${apiUrl}/img/blogposts/${fileName}`,
        cover: req.file.path,
        updatedAt: new Date(),
      };
      blogpostsArray[index] = updatedBlogpost;
      await writeBlogs(blogpostsArray);
      res.send({ message: "file uploaded" });
    } catch (error) {
      next(error);
    }
  }
);

filesRouter.get("/:blogId/pdf", async (req, res, next) => {
  try {
    // res.setHeader("Content-Disposition", "attachment; filename=blog.pdf"); // Without this header the browser will try to open (not save) the file.
    res.setHeader("Content-Type", "application/pdf"); // Without this header the browser will try to open (not save) the file.
    // This header will tell the browser to open the "save file as" dialog
    // SOURCE (READABLE STREAM pdfmake) --> DESTINATION (WRITABLE STREAM http response)
    const blogpostsArray = await getBlogs();
    const index = blogpostsArray.findIndex(
      (blogpost) => blogpost._id === req.params.blogId
    );
    if (index === -1) {
      res.status(404).send("blog is not found");
    }
    const blog = blogpostsArray[index];
    const source = getPDFReadableStream(blog);
    const destination = res;

    pipeline(source, destination, (err) => {
      if (err) console.log(err);
      source.end();
    });
  } catch (error) {
    next(error);
  }
});

export default filesRouter;
