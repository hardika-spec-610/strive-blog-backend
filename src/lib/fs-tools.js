import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data"); // D:\Work\Epicode\2022\EN\BE-Master-04\U4\epicode-u4-d4-4\src\data
const authorJSONPath = join(dataFolderPath, "authors.json");
const bolgsJSONPath = join(dataFolderPath, "blogs.json");
// const usersPublicFolderPath = join(process.cwd(), "./public/img/users");

export const getAuthors = () => readJSON(authorJSONPath);
export const writeAuthors = (authorsArray) =>
  writeJSON(authorJSONPath, authorsArray);
export const getBlogs = () => readJSON(bolgsJSONPath);
export const writeBlogs = (blogsArray) => writeJSON(bolgsJSONPath, blogsArray);

// export const saveUsersAvatars = (fileName, fileContentAsBuffer) =>
//   writeFile(join(usersPublicFolderPath, fileName), fileContentAsBuffer);
