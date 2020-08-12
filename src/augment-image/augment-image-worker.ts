import { random, sampleSize } from "lodash";

import jimp from "jimp";
import { rotate } from "./rotate";
import { scale } from "./scale";
import { shiftHeight } from "./shift-height";
import { shiftWidth } from "./shift-width";
import workerpool from "workerpool";

const operations = [
  (image: jimp) => image.flip(true, false),
  (image: jimp) => shiftWidth(image, 0.15),
  (image: jimp) => shiftHeight(image, 0.15),
  (image: jimp) => scale(image, 0.5),
  (image: jimp) => rotate(image, 45)
];

const generateAugmentImage = async (path: string, shape: number) => {
  const image = (await jimp.read(path)).resize(
    shape,
    shape
  );
  const operationsImageResult = sampleSize(
    operations,
    random(0, operations.length)
  ).reduce((image: jimp, operation: (image: jimp) => jimp) => operation(image), image);
  
  // await operationsImageResult.writeAsync(`test_photo/${path}`);
  // console.log(`test_photo/${path}`)
  const buffer = await operationsImageResult.getBufferAsync(jimp.MIME_PNG);
  return buffer;
};

workerpool.worker({
  generateAugmentImage: generateAugmentImage,
});
