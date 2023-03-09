import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } =
  fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data"); // D:\Work\Epicode\2022\EN\BE-Master-04\U4\epicode-u4-d4-4\src\data
const authorJSONPath = join(dataFolderPath, "authors.json");
const bolgsJSONPath = join(dataFolderPath, "blogs.json");
const usersPublicFolderAuthorPath = join(process.cwd(), "./public/img/authors");
const usersPublicFolderBlogPath = join(process.cwd(), "./public/img/blogPosts");

export const getAuthors = () => readJSON(authorJSONPath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorJSONPath, authorsArray);
export const getBlogs = () => readJSON(bolgsJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(bolgsJSONPath, blogsArray);

export const saveAuthorsAvatars = (fileName, fileContentAsBuffer) =>
  writeFile(join(usersPublicFolderAuthorPath, fileName), fileContentAsBuffer);

export const saveBlogPostsCover = (fileName, fileContentAsBuffer) =>
  writeFile(join(usersPublicFolderBlogPath, fileName), fileContentAsBuffer);

// export const getBlogsJSONReadableStream = () => createReadStream(bolgsJSONPath);
// export const getPDFWritableStream = (filename) =>
//   createWriteStream(join(dataFolderPath, filename));
export const getAuthorsJSONReadableStream = () =>
  createReadStream(authorJSONPath);
export const getPDFWritableStream = (filename) =>
  createWriteStream(join(dataFolderPath, filename));

export const getPDFWritableCSVStream = (filename) =>
  createWriteStream(join(dataFolderPath, filename));
