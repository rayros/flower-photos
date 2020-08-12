import { range, sample } from "lodash";

import jimp from "jimp";

export const rotate = (image: jimp, degRange: number) => {
  const deg = sample(range(-degRange, degRange, 1));
  const steps = deg < 0 ? range(deg, 0, 5).reverse() : range(0, deg, 5);
  return steps.reduce((newImage: jimp, deg: number) => {
    const rotatedImage = image.clone().rotate(deg, false);
    return newImage.composite(rotatedImage, 0, 0);
  }, image.clone());
};
 
// const test = async () => {
//   let originalImage = await jimp.read('photos/flower_photos/daisy/5547758_eea9edfd54_n.jpg');
//   rotate(originalImage, -45).writeAsync('test2.jpg');
// }

// test()
