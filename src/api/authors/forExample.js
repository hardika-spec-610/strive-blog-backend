// *********************************************** USERS RELATED ENDPOINTS ******************************************

/* ************************************************* USERS CRUD ENDPOINTS *******************************************
1. CREATE --> POST http://localhost:3001/users/ (+ body)
2. READ --> GET http://localhost:3001/users/ (+ optional query search params)
3. READ (single user) --> GET http://localhost:3001/users/:userId
4. UPDATE (single user) --> PUT http://localhost:3001/users/:userId (+ body)
5. DELETE (single user) --> DELETE http://localhost:3001/users/:userId
*/

import Express from "express"; // 3RD PARTY MODULE (npm i express)
import fs from "fs"; // CORE MODULE (no need to install it!!!!)
import { fileURLToPath } from "url"; // CORE MODULE
import { dirname, join } from "path"; // CORE MODULE
import uniqid from "uniqid";

const authorsRouter = Express.Router(); // an Express Router is a set of similar endpoints grouped in the same collection
// ******************** HOW TO GET USERS.JSON PATH **********************

// target --> F:\Work\Epicode\2022\EN\BE-Master-04\U4\epicode-u4-d2-4\src\api\users\users.json

// 1. We gonna start from the current's file path F:\Work\Epicode\2022\EN\BE-Master-04\U4\epicode-u4-d2-4\src\api\users\index.js
// console.log("CURRENT FILE URL:", import.meta.url);
// console.log("CURRENT FILE PATH:", fileURLToPath(import.meta.url));
// // 2. We can then obtain the parent's folder path F:\Work\Epicode\2022\EN\BE-Master-04\U4\epicode-u4-d2-4\src\api\users\
// console.log("PARENT'S FOLDER PATH:", dirname(fileURLToPath(import.meta.url)));
// // 3. Finally we can concatenate parent's folder path with "users.json" --> F:\Work\Epicode\2022\EN\BE-Master-04\U4\epicode-u4-d2-4\src\api\users\users.json
// console.log(
//   "TARGET:",
//   join(dirname(fileURLToPath(import.meta.url)), "authors.json")
// ); // WHEN YOU CONCATENATE TWO PATHS TOGETHER USE JOIN!!! (not the '+' symbol)

const authorJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "authors.json"
);
console.log(
  "TARGET:",
  join(dirname(fileURLToPath(import.meta.url)), "authors.json")
);

// 1.
authorsRouter.post("/", (req, res) => {
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
  // 3. Save new user into users.json file

  // 3.1 Read the content of the file, obtaining an array
  const authorsArray = JSON.parse(fs.readFileSync(authorJSONPath));

  // 3.2 Add the new user to the array
  authorsArray.push(newAuthor);

  // 3.3 Write the array back to the file
  fs.writeFileSync(authorJSONPath, JSON.stringify(authorsArray)); // we cannot pass an array here, it needs to be converted into a string

  // 4. Send back a proper response
  res.status(201).send(authorsArray);
});

//6
authorsRouter.post("/checkEmail", (req, res) => {
  console.log("req body:", req.body);
  let email = req.body.email;
  const authorsArray = JSON.parse(fs.readFileSync(authorJSONPath));
  let emailExists = authorsArray.some(
    (author) => author.email.toLowerCase() === email.toLowerCase()
  );
  res.status(201).send({
    exists: emailExists,
  });
});

// 2.
authorsRouter.get("/", (req, res) => {
  // 1. Read the content of users.json file
  const fileContentAsBuffer = fs.readFileSync(authorJSONPath); // This is going to give us back a BUFFER object, which is a MACHINE READABLE FORMAT
  //   console.log("FILE CONTENT:", fileContentAsBuffer);

  // 2. We shall convert the buffer into an array
  //console.log("FILE CONTENT AS ARRAY:", JSON.parse(fileContentAsBuffer))
  const authorsArray = JSON.parse(fileContentAsBuffer);

  // 3. Send the array of users back as response
  res.send(authorsArray);
});

// 3.
authorsRouter.get("/:authorId", (req, res) => {
  // 1. Extract the userId from the URL
  console.log("AUTHOR ID:", req.params.authorId);

  // 2. Read users.json file --> obtaining an array
  const authorsArray = JSON.parse(fs.readFileSync(authorJSONPath));

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
authorsRouter.put("/:authorId", (req, res) => {
  // 1. Read the file obtaining an array
  const authorsArray = JSON.parse(fs.readFileSync(authorJSONPath));

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
  fs.writeFileSync(authorJSONPath, JSON.stringify(authorsArray));

  // 4. Send back a proper response
  res.send(updatedAuthor);
});

// 5.
authorsRouter.delete("/:authorId", (req, res) => {
  // 1. Read the file obtaining an array
  const authorsArray = JSON.parse(fs.readFileSync(authorJSONPath));

  // 2. Filter out the specified user from the array, keep just the remaining users
  const remainingAuthors = authorsArray.filter(
    (author) => author.id !== req.params.authorId
  );

  // 3. Save the array of remaining users back to the file
  fs.writeFileSync(authorJSONPath, JSON.stringify(remainingAuthors));

  // 4. Send back a proper response
  res.status(204).send();
});

export default authorsRouter;
