// *********************************************** USERS RELATED ENDPOINTS ******************************************

/* ************************************************* USERS CRUD ENDPOINTS *******************************************
1. CREATE --> POST http://localhost:3001/users/ (+ body)
2. READ --> GET http://localhost:3001/users/ (+ optional query search params)
3. READ (single user) --> GET http://localhost:3001/users/:userId
4. UPDATE (single user) --> PUT http://localhost:3001/users/:userId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/users/:userId
*/

import Express from "express"; // 3RD PARTY MODULE (npm i express)
import uniqid from "uniqid";
import {
  getAuthors,
  saveAuthorsAvatars,
  writeAuthors,
} from "../../lib/fs-tools.js";
import multer from "multer";
import { extname } from "path";
import { getAuthorsPDFReadableStream } from "../../lib/pdf-tools.js";

const authorsRouter = Express.Router(); // an Express Router is a set of similar endpoints grouped in the same collection

// 1.
authorsRouter.post("/", async (req, res) => {
  // 1. Read the request body
  console.log("REQUEST BODY:", req.body); // DO NOT FORGET TO ADD EXPRESS.JSON INTO SERVER.JS!!!!!!!!!!!!!!!!
  // 2. Add some server generated info (unique id, createdAt, ...)
  const { name, surname, email, DOB, avatar } = req.body;
  const newAuthor = {
    name,
    surname,
    email,
    DOB,
    avatar,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: uniqid(),
  };
  const authorsArray = await getAuthors();
  authorsArray.push(newAuthor);
  await writeAuthors(authorsArray);
  res.status(201).send(authorsArray);
});

//6
authorsRouter.post("/checkEmail", async (req, res) => {
  console.log("req body:", req.body);
  let email = req.body.email;
  const authorsArray = await getAuthors();
  let emailExists = authorsArray.some(
    (author) => author.email.toLowerCase() === email.toLowerCase()
  );
  res.status(201).send({
    exists: emailExists,
  });
});

// 2.
authorsRouter.get("/", async (req, res) => {
  const authorsArray = await getAuthors();
  res.send(authorsArray);
});

// 3.
authorsRouter.get("/:authorId", async (req, res) => {
  // 1. Extract the userId from the URL
  console.log("AUTHOR ID:", req.params.authorId);
  const authorsArray = await getAuthors();
  // 3. Search for the specified user into the array
  const author = authorsArray.find(
    (author) => author.id === req.params.authorId
  );
  if (!author) {
    res
      .status(404)
      .send({ message: `Autgor with ${req.params.authorId} is not found` });
  }
  // 4. Send the found user as a response
  res.send(author);
});

// 4.
authorsRouter.put("/:authorId", async (req, res) => {
  // 1. Read the file obtaining an array
  const authorsArray = await getAuthors();
  // 2. Modify the specified user by merging previous properties with the properties coming from req.body
  const index = authorsArray.findIndex(
    (author) => author.id === req.params.authorId
  );
  if (!index == -1) {
    res
      .status(404)
      .send({ message: `Autgor with ${req.params.authorId} is not found` });
  }
  const oldAuthor = authorsArray[index];
  const updatedAuthor = { ...oldAuthor, ...req.body, updatedAt: new Date() };
  authorsArray[index] = updatedAuthor;

  // 3. Save the modified array back to disk
  await writeAuthors(authorsArray);
  // 4. Send back a proper response
  res.send(updatedAuthor);
});

// 5.
authorsRouter.delete("/:authorId", async (req, res) => {
  // 1. Read the file obtaining an array
  const authorsArray = await getAuthors();
  // 2. Filter out the specified user from the array, keep just the remaining users
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );
  // 3. Save the array of remaining users back to the file
  await writeAuthors(remainingAuthors);
  // 4. Send back a proper response
  res.status(204).send();
});

// authorsRouter.get("/asyncPDF", async (req, res, next) => {
//   try {
//     res.setHeader("Content-Disposition", "attachment; filename=authors.pdf");
//     const authors = await getAuthors();
//     console.log("authors", authors);
//     const source = await getAuthorsPDFReadableStream(authors);
//     const destination = res;
//     pipeline(source, destination, (err) => {
//       if (err) console.log(err);
//       source.end();
//     });
//   } catch (error) {
//     next(error);
//   }
// });

export default authorsRouter;
