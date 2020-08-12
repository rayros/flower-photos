import { readdirSync } from "fs";

export const getFiles = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name);
