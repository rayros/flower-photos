import { imageBufferToInputTensor } from "./image-buffer-to-input-tensor";
import jimp from "jimp";

export const imageFileToTensor = async (path: string, shape: number) => {
  const file = await jimp.read(path);
  const image = file.resize(
    shape,
    shape
  );
  const buffer = await image.getBufferAsync(jimp.MIME_PNG);
  return imageBufferToInputTensor(buffer);
};
