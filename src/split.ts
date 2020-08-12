import * as tf from "@tensorflow/tfjs";

import { Record } from './record.interface';

export const splitRecords = (records: Record[], validationSplit: number = 0.2) => {
  const validationExamplesNum = Math.round(records.length * validationSplit);
  const validationRecords = records.slice(0, validationExamplesNum);
  const trainRecords = records.slice(validationExamplesNum);
  tf.util.shuffle(trainRecords);
  return {
    trainRecords,
    validationRecords,
  };
};