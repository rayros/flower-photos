import { range, sample } from "lodash";

import jimp from "jimp";

export const shiftHeight = (image: jimp, maxShift: number) => {
  const cropPercent = sample(range(0, maxShift, 0.01));
  const shiftStart = sample([true, false]);
  const w = image.getWidth();
  const h = image.getHeight();
  const shiftY = h * cropPercent;
  const rememberColor = {};
  const imageClone = image.clone();

  if (shiftStart) {
    imageClone.scan(0, 0, w, h, function (x, y, idx) {
      if (!rememberColor[x]) {
        const index = image.getPixelIndex(x, 0);
        rememberColor[x] = [
          this.bitmap.data[index + 0],
          this.bitmap.data[index + 1],
          this.bitmap.data[index + 2],
          this.bitmap.data[index + 3],
        ];
      }
      if (y + shiftY <= w) {
        const idx2 = image.getPixelIndex(x, y + shiftY);
        [0, 1, 2, 3].forEach((i) => {
          image.bitmap.data[idx2 + i] = this.bitmap.data[idx + i];
          if (y < shiftY) {
            image.bitmap.data[idx + i] = rememberColor[x][i];
          }
        });
      }
    });
  } else {
    imageClone.scan(0, 0, w, h, function (x, y, idx) {
      if (!rememberColor[x]) {
        const index = image.getPixelIndex(x, h - 1);
        rememberColor[x] = [
          this.bitmap.data[index + 0],
          this.bitmap.data[index + 1],
          this.bitmap.data[index + 2],
          this.bitmap.data[index + 3],
        ];
      }
      if (y - shiftY >= 0) {
        const idx2 = image.getPixelIndex(x, y - shiftY);
        [0, 1, 2, 3].forEach((i) => {
          image.bitmap.data[idx2 + i] = this.bitmap.data[idx + i];
          if (y >= h - shiftY - 1) {
            image.bitmap.data[idx + i] = rememberColor[x][i];
          }
        });
      }
    });
  }
  return image;
};
