import "@tensorflow/tfjs-node";

import * as tf from "@tensorflow/tfjs";

import { Record } from './record.interface';
import decompress from "decompress";
import { download } from "./download";
import { getDirectories } from "./get-directories";
import { getFiles } from "./get-files";
import { getModel } from "./model";
import { imageBufferToInputTensor } from "./image-buffer-to-input-tensor";
import { imageFileToTensor } from "./image-file-to-tensor";
import { mergeAlternate } from "./merge-alternate";
import { splitRecords } from "./split";
import workerpool from "workerpool";

const augmentImagePool = workerpool.pool(
  __dirname + "/augment-image/augment-image-worker.js"
);

const URL =
  "https://storage.googleapis.com/download.tensorflow.org/example_images/flower_photos.tgz";

const features = (records: Record[]) =>
  function* () {
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const path = record.imagePath;
      yield path;
    }
  };

const labels = (records: Record[], labels: string[]) =>
  function* () {
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      const indexOfLabel = labels.indexOf(record.label);
      if (indexOfLabel === -1) {
        throw new Error(
          `Something wrong. Missing label: ${
            record.label
          } in labels: ${labels.toString()}`
        );
      }
      yield tf.oneHot(indexOfLabel, labels.length);
    }
  };


const start = async () => {
  await download(URL, "/tmp/flower_photos.tgz");
  await decompress("/tmp/flower_photos.tgz", "photos");
  const IMAGE_SHAPE = 150;
  const IMAGE_CHANNELS = 3;
  const LABELS = getDirectories("photos/flower_photos");
  const LABELS_NUM = LABELS.length;
  const BATCH_SIZE = 100;
  const model = getModel(IMAGE_SHAPE, IMAGE_CHANNELS, LABELS_NUM);
  
  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: "adam",
    metrics: ["accuracy"],
  });

  const recordsByLabel = LABELS.map((label: string) => {
    const files = getFiles(`photos/flower_photos/${label}`);
    return files.map((file) => ({
      imagePath: `photos/flower_photos/${label}/${file}`,
      label,
    }));
  });
  const records = mergeAlternate(recordsByLabel);
  const { trainRecords, validationRecords } = splitRecords(records);
  const trainX = tf.data
    .generator(features(trainRecords))
    .mapAsync(async (path: string) => {
      const image = await augmentImagePool.exec("generateAugmentImage", [
        path,
        IMAGE_SHAPE,
      ]);
      return imageBufferToInputTensor(image);
    })
    .prefetch(BATCH_SIZE * 3);
  const trainY = tf.data.generator(labels(trainRecords, LABELS));
  const trainDataset = tf.data
    .zip({ xs: trainX, ys: trainY })
    .shuffle(8, `${Math.random()}`, true)
    .batch(BATCH_SIZE)
    .repeat();
  const validationX = tf.data
    .generator(features(validationRecords))
    .mapAsync(async (path: string) => {
      return imageFileToTensor(path, IMAGE_SHAPE);
    });
  const validationY = tf.data.generator(labels(validationRecords, LABELS));
  const validationDataset = tf.data
    .zip({ xs: validationX, ys: validationY })
    .batch(BATCH_SIZE);
  await model.fitDataset(trainDataset, {
    epochs: 80,
    batchesPerEpoch: Math.floor(trainRecords.length / BATCH_SIZE),
    validationData: validationDataset,
    validationBatches: parseInt(String(validationRecords.length / BATCH_SIZE)),
    // callbacks: [tf.callbacks.earlyStopping({ monitor: 'val_acc', patience: 5 })]
  });
  await model.save("file://flower-model");
  await augmentImagePool.terminate();
};

start().catch((error) => {
  console.log(error);
  process.exit(1);
});
