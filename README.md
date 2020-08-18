# Classify flowers with Tensorflow.js

Install:

```bash
npm install
```

Train:

```bash
npm run train
```

Predict:

```bash
npm run predict photos/flower_photos/daisy/5794839_200acd910c_n.jpg
```

Quantization (Compression):

```bash
tensorflowjs_converter --quantize_float16 --input_format tfjs_layers_model --output_format=tfjs_layers_model flower-model/model.json quantized-flower-model/
```

Graph model (Performance optimization):

```bash
tensorflowjs_converter --quantize_float16 --input_format tfjs_layers_model --output_format=tfjs_graph_model flower-model/model.json quantized-graph-flower-model/
```

https://research.google/pubs/pub48051/


sources:

- https://github.com/ya9do/tfjs-data-generator-sample/blob/master/src/index.ts
- https://github.com/tensorflow/tfjs-examples/blob/master/iris-fitDataset/data.js
- https://js.tensorflow.org/api/latest/#data.generator
