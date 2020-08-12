import { range, sample } from "lodash";

import jimp from "jimp";

function slope(a, b) {
  if (a[0] == b[0]) {
    return null;
  }

  return (b[1] - a[1]) / (b[0] - a[0]);
}

function intercept(point, slope) {
  if (slope === null) {
    // vertical line
    return point[0];
  }

  return point[1] - slope * point[0];
}

export const scale = (image: jimp, scaleRange: number) => {
  const scalePercentX = sample(range(1 - scaleRange, 1 + scaleRange, 0.01));
  const scalePercentY = sample(range(1 - scaleRange, 1 + scaleRange, 0.01));
  const w = image.getWidth();
  const h = image.getHeight();
  const offsetX = (w - w * scalePercentX) * 0.5;
  const offsetY = (h - h * scalePercentY) * 0.5;
  const imageOriginal = image.clone();
  if (offsetX > 0 || offsetY > 0) {
    const A = [0, 0];
    const B = [offsetX, offsetY];
    const m = slope(A, B);
    const b = intercept(A, m);

    for (let x = A[0]; x <= B[0]; x++) {
      const y = m * x + b;
      const scaledImage = imageOriginal.clone().resize(w - x * 2, h - y * 2);
      image.composite(scaledImage, x, y);
    }
    return image;
  } else {
    const scaledImage = image
      .clone()
      .resize(w * scalePercentX, h * scalePercentY);
    return image.composite(scaledImage, offsetX, offsetY);
  }
};

// const test = async () => {
//   let originalImage = await jimp.read('photos/flower_photos/daisy/5547758_eea9edfd54_n.jpg');
//   scale(originalImage, 0.5).writeAsync('test2.jpg');
// }

// test()
