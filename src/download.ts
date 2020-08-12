import { createWriteStream, promises } from "fs";

import { get } from "https";

export const download = (url: string, destination: string) => {
  return new Promise((resolve: () => void, reject) => {
    const file = createWriteStream(destination);
    get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        resolve();
      });
    }).on("error", async (err) => {
      await promises.unlink(destination);
      reject(err.message);
    });
  });
};