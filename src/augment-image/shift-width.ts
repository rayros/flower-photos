import { range, sample } from "lodash";

import jimp from "jimp";

export const shiftWidth = (image: jimp, maxShift: number) => {
  const cropPercent = sample(range(0, maxShift, 0.01));
  const shiftStart = sample([true, false]);
  const w = image.getWidth();
  const h = image.getHeight();
  const shiftX = w * cropPercent;
  const rememberColor = {};
  const imageClone = image.clone();

  if (shiftStart) {
    imageClone.scan(0, 0, w, h, function (x, y, idx) {
      if (!rememberColor[y]) {
        const index = image.getPixelIndex(0, y);
        rememberColor[y] = [
          this.bitmap.data[index + 0],
          this.bitmap.data[index + 1],
          this.bitmap.data[index + 2],
          this.bitmap.data[index + 3],
        ];
      }
      if (x + shiftX <= w) {
        const idx2 = image.getPixelIndex(x + shiftX, y);
        [0, 1, 2, 3].forEach((i) => {
          image.bitmap.data[idx2 + i] = this.bitmap.data[idx + i];
          if (x < shiftX) {
            image.bitmap.data[idx + i] = rememberColor[y][i];
          }
        });
      }
    });
  } else {
    imageClone.scan(0, 0, w, h, function (x, y, idx) {
      if (!rememberColor[y]) {
        const index = image.getPixelIndex(w - 1, y);
        rememberColor[y] = [
          this.bitmap.data[index + 0],
          this.bitmap.data[index + 1],
          this.bitmap.data[index + 2],
          this.bitmap.data[index + 3],
        ];
      }
      if (x - shiftX >= 0) {
        const idx2 = image.getPixelIndex(x - shiftX, y);
        [0, 1, 2, 3].forEach((i) => {
          image.bitmap.data[idx2 + i] = this.bitmap.data[idx + i];
          if (x >= w - shiftX - 1) {
            image.bitmap.data[idx + i] = rememberColor[y][i];
          }
        });
      }
    });
  }
  return image;
};
