import "@tensorflow/tfjs-node";

import * as tf from "@tensorflow/tfjs";

import { decodeImage } from "@tensorflow/tfjs-node/dist/image";

export const imageBufferToInputTensor = async (imageBuffer: Buffer) => {
  const normalized = tf.tidy(() => {
    const offset = tf.scalar(127.5);
    return decodeImage(imageBuffer, 3).sub(offset).div(offset);
  });
  return normalized;
};
