import * as tf from "@tensorflow/tfjs";

export const getModel = (imageShape: number, imageChannels: number, labelsNumber: number) => tf.sequential({
  layers: [
    tf.layers.conv2d({
      filters: 16,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
      inputShape: [imageShape, imageShape, imageChannels],
      kernelInitializer: "varianceScaling",
    }),
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    }),
    tf.layers.conv2d({
      filters: 32,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
      kernelInitializer: "varianceScaling",
    }),
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    }),
    tf.layers.conv2d({
      filters: 64,
      kernelSize: 3,
      strides: 1,
      padding: "same",
      activation: "relu",
      kernelInitializer: "varianceScaling",
    }),
    tf.layers.maxPooling2d({
      poolSize: 2,
      strides: 2,
    }),
    tf.layers.flatten(),
    tf.layers.dropout({
      rate: 0.2,
    }),
    tf.layers.dense({
      units: 512,
      kernelInitializer: "varianceScaling",
      activation: "relu",
    }),
    tf.layers.dropout({
      rate: 0.2,
    }),
    tf.layers.dense({
      units: labelsNumber,
      kernelInitializer: "varianceScaling",
      activation: "softmax",
    }),
  ]
});