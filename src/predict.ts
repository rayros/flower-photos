import "@tensorflow/tfjs-node";

import * as tf from "@tensorflow/tfjs";

import { getDirectories } from "./get-directories";
import { imageFileToTensor } from "./image-file-to-tensor";

const start = async () => {
  const model = await tf.loadLayersModel("file://flower-model/model.json");
  model.compile({
    loss: "categoricalCrossentropy",
    optimizer: "adam",
    metrics: ["accuracy"],
  });
  const imagePath = process.argv[2];
  if (!imagePath) {
    throw new Error('Missing image path');
  }
  const tensor = await imageFileToTensor(
    imagePath,
    150
  );

  const result = model.predict(tf.expandDims(tensor, 0));
  console.log(result.toString());
  const argMax = Array.isArray(result) ? result[1].argMax(1) : result.argMax(1);
  const LABELS = getDirectories("photos/flower_photos");
  const predictedLabel = LABELS[argMax.dataSync()[0]];
  console.log(predictedLabel);
};
start().catch(error => console.error(error));