"use strict" // Crashes hard

// Import functionality
const tf = require('@tensorflow/tfjs-node')
const fs = require('fs')

var COUNTER = 25
const ATTEMPT = 1

// Read dataset
var xs = [], ys = []
var val_xs = [], val_ys = [] // Validation sets to avoid overfitting

console.log("Reading JSON")
const contents = fs.readFileSync('do_not_touch_databomb/dataset.json', 'utf8')
const dataset = JSON.parse(contents)
console.log("JSON read")
console.log(dataset.length)

for (const pair of dataset.splice(0, 1000)) {
  val_xs.push(pair.val)
  val_ys.push(pair.label)
}
val_xs = tf.tensor(val_xs)
val_ys = tf.tensor(val_ys)
for (const pair of dataset) { // .splice() is mutating, so dataset no longer has first 1000 datapoints
  xs.push(pair.val)
  ys.push(pair.label)
}
xs = tf.tensor(xs)
ys = tf.tensor(ys)


async function test_model(model) {
  console.log("evaluating")
  var results = model.evaluate(val_xs, val_ys)
  console.log("Loss:", results[0].arraySync())
  console.log("Acc:", results[1].arraySync())
}


// Main loop
async function run() {
  var model = await tf.loadLayersModel(`file://./checkpoints/attempt${ATTEMPT}/checkpoint${COUNTER}/model.json`)
  
  var tests = tf.tensor([
  [
     0.765625, 0.8515625,   0.78125,      0.25,   0.78125, 0.828125,    0.9375,
         0.25,  0.609375,      0.25,  0.796875,  0.890625,     0.25,  0.796875,
         0.25, 0.8984375,  0.828125,  0.953125, 0.9296875,  0.90625, 0.8984375,
         0.25,  0.828125, 0.8984375, 0.8671875,   0.90625,  0.78125,  0.828125,
    0.9296875,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0
  ],
  [
    0.828125,   0.84375, 0.8984375,      0.25,     0.875, 0.8984375,  0.796875,
        0.25,  0.671875,      0.25, 0.7890625, 0.8046875,      0.25,  0.890625,
        0.25,  0.765625,  0.890625,    0.8125,  0.921875, 0.8203125, 0.7890625,
        0.25, 0.8984375, 0.7578125, 0.9296875, 0.8984375, 0.8984375,  0.921875,
    0.796875,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0
  ],
  [
    0.5859375, 0.6640625,  0.359375,      0.25,  0.046875,  1.046875, 1.8984375,
    1.1796875,   1.40625, 0.4609375, 0.2734375, 0.5390625, 0.5859375,   1.59375,
    1.5234375,  0.890625, 0.8515625,  1.046875,  1.296875, 1.3671875, 1.5859375,
            1, 0.7734375,  1.828125, 0.9609375,  0.609375, 0.3828125, 1.0234375,
    1.3515625,  0.390625, 1.4140625, 0.1328125,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ],
  [
    0.4296875, 0.3828125,  0.765625, 0.3828125,  0.421875, 0.4453125,
     0.765625,  0.765625,     0.375,  0.765625,   0.40625, 0.4140625,
     0.390625, 0.4140625, 0.7890625, 0.3984375,  0.390625,  0.390625,
    0.3828125, 0.4453125, 0.3984375,   0.78125,   0.40625, 0.4140625,
    0.4140625, 0.4140625, 0.4140625, 0.4453125, 0.3984375,  0.765625,
    0.7890625, 0.7890625, 0.3828125,  0.421875, 0.4296875, 0.7734375,
      0.78125, 0.4453125, 0.4453125,  0.421875,  0.421875,   0.40625,
    0.3828125,    0.4375, 0.4140625, 0.3828125,  0.390625,  0.421875,
     0.390625, 0.7734375,  0.390625,  0.421875, 0.7890625,   0.40625,
     0.796875, 0.3828125, 0.4453125,   0.40625,  0.390625,  0.390625,
    0.4140625, 0.4296875,     0.375, 0.4296875,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0
  ],
  [
     0.765625,     0.375,   0.78125, 0.4296875, 0.4296875,     0.375,   0.78125,
      0.40625,    0.4375, 0.7890625,  0.765625, 0.7734375,  0.421875, 0.4296875,
      0.40625, 0.4296875,  0.796875, 0.4296875,  0.796875,   0.40625, 0.4140625,
       0.4375,    0.4375, 0.4140625,     0.375,   0.78125, 0.4296875,  0.390625,
     0.421875,  0.421875,  0.765625, 0.4296875, 0.4140625, 0.7734375, 0.4140625,
    0.4296875,  0.796875,    0.4375,     0.375, 0.7734375,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ],
  [
     0.421875,  0.796875,  0.796875,  0.765625, 0.3984375, 0.3984375,    0.4375,
    0.4453125,   0.78125,  0.390625, 0.4140625, 0.7890625, 0.7734375, 0.4296875,
     0.765625,  0.796875,     0.375, 0.3984375, 0.7890625,     0.375, 0.4296875,
    0.4140625, 0.3984375, 0.7578125, 0.3828125,  0.390625, 0.4296875, 0.4140625,
    0.7890625, 0.3984375,  0.796875,   0.40625,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ],
  [
      0.78125,  0.390625,    0.8125, 0.4140625, 0.5703125,    0.5625,   0.84375,
      0.84375, 0.7734375, 0.9453125,  0.515625,  0.578125, 0.5703125, 0.5546875,
     0.546875,   0.90625, 0.5703125, 0.5546875, 0.5390625, 0.8046875,  0.765625,
    0.8515625,  0.671875, 0.3828125, 0.7734375, 0.8515625, 0.4453125, 0.9140625,
    0.5703125, 0.5546875,  0.671875, 0.9140625, 0.7578125, 0.8515625, 0.4453125,
    0.4140625,  0.703125,    0.6875, 0.5703125, 0.4765625,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ],
  [
       0.6875, 0.3671875,   0.96875, 0.3515625,   0.96875, 0.6953125,     0.25,
    0.6953125, 0.3984375, 0.4140625,      0.25, 0.2578125,      0.25,  0.40625,
      0.96875,  0.671875,   0.96875,      0.25,   0.40625,      0.25,  0.96875,
      0.96875, 0.3984375,    0.3125, 0.7421875, 0.3203125,   0.96875, 0.390625,
        0.375,   0.96875,   0.96875,      0.25, 0.3984375,   0.96875,  0.96875,
     0.578125,     0.375, 0.6953125, 0.3984375,   0.96875,  0.390625,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0
  ],
  [
     0.359375, 0.3515625, 0.3515625,      0.25,  0.359375,  0.359375,
     0.359375,  0.359375,      0.25, 0.3515625,  0.359375, 0.3515625,
    0.3515625,      0.25, 0.3671875,      0.25, 0.3515625,  0.359375,
    0.3515625, 0.3515625,      0.25,  0.359375,      0.25,  0.359375,
     0.359375,  0.359375,      0.25, 0.3671875,      0.25,  0.359375,
     0.359375,      0.25, 0.3671875,      0.25,  0.359375, 0.3515625,
         0.25, 0.3515625, 0.3515625,      0.25, 0.3671875,      0.25,
     0.359375, 0.3515625,      0.25, 0.3671875,      0.25, 0.3515625,
     0.359375,      0.25,  0.359375,      0.25,  0.359375,  0.359375,
    0.3515625,      0.25,  0.359375, 0.3515625,  0.359375,      0.25,
    0.3515625, 0.3515625, 0.3515625,      0.25, 0.3515625,  0.359375,
         0.25, 0.3671875,      0.25,  0.359375,      0.25, 0.3515625,
     0.359375,      0.25,  0.359375, 0.3515625, 0.3515625, 0.3515625,
         0.25, 0.3515625, 0.3515625, 0.3515625,      0.25, 0.3515625,
     0.359375, 0.3515625, 0.3515625,      0.25,  0.359375,      0.25,
     0.359375, 0.3515625,  0.359375,         0,         0,         0,
            0,         0,         0,         0
  ],
  [
    0.3828125, 0.3828125, 0.3828125,     0.375, 0.3828125, 0.3828125,
    0.3828125, 0.3828125, 0.3828125,     0.375, 0.3828125,     0.375,
        0.375,     0.375, 0.3828125, 0.3828125, 0.3828125, 0.3828125,
        0.375,     0.375, 0.3828125, 0.3828125,     0.375,     0.375,
        0.375,     0.375,     0.375, 0.3828125, 0.3828125, 0.3828125,
    0.3828125,     0.375,     0.375, 0.3828125, 0.3828125, 0.3828125,
        0.375,     0.375, 0.3828125,     0.375, 0.3828125, 0.3828125,
    0.3828125, 0.3828125,     0.375,     0.375, 0.3828125, 0.3828125,
    0.3828125,     0.375,     0.375,     0.375,     0.375,     0.375,
    0.3828125,     0.375,     0.375, 0.3828125,     0.375,     0.375,
    0.3828125, 0.3828125,     0.375,     0.375,     0.375,     0.375,
        0.375, 0.3828125, 0.3828125,     0.375,     0.375,     0.375,
        0.375, 0.3828125, 0.3828125, 0.3828125,     0.375, 0.3828125,
    0.3828125,     0.375, 0.3828125, 0.3828125,     0.375,     0.375,
        0.375,     0.375,     0.375, 0.3828125, 0.3828125,     0.375,
        0.375,     0.375,     0.375, 0.3828125, 0.3828125,     0.375,
        0.375,     0.375,     0.375,     0.375
  ],
  [
    0.9296875,    0.8125, 0.9453125,      0.25, 0.9453125, 0.7890625, 0.8984375,
         0.25, 0.5703125,      0.25, 0.7578125, 0.8515625,      0.25, 0.7578125,
         0.25,  0.859375, 0.7890625, 0.9140625,  0.890625, 0.8671875,  0.859375,
         0.25, 0.7890625,  0.859375,  0.828125, 0.8671875, 0.9453125, 0.7890625,
     0.890625,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ]
])
  var result = model.predict(tests)
  result.print()

  const optimizer = tf.train.adam(0.002)
  model.compile({
    optimizer,
    loss: "meanSquaredError",
    metrics: ['accuracy']
  })
  await test_model(model)

  // Training
  console.log("training")
  await model.fit(xs, ys, {
    validationData: (val_xs, val_ys),
    shuffle: true,
    batchSize: 3,
    epochs: 100,
    callbacks: {
      onEpochEnd: (epoch, log) => {
        COUNTER++
        if (COUNTER % 1 == 0) {
          console.log(`Epoch ${epoch}:\taccuracy = ${log.acc}\tloss = ${log.loss}`)
          model.save(`file://./checkpoints/attempt${ATTEMPT}/checkpoint${COUNTER}`)
          test_model(model)
        }
      }
    }
  })

  await model.save(`file://./checkpoints/attempt${ATTEMPT}/checkpointDone`)

  test_model(model)
  tests = tf.tensor([
  [
     0.765625, 0.8515625,   0.78125,      0.25,   0.78125, 0.828125,    0.9375,
         0.25,  0.609375,      0.25,  0.796875,  0.890625,     0.25,  0.796875,
         0.25, 0.8984375,  0.828125,  0.953125, 0.9296875,  0.90625, 0.8984375,
         0.25,  0.828125, 0.8984375, 0.8671875,   0.90625,  0.78125,  0.828125,
    0.9296875,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0,         0,         0,         0,        0,         0,
            0,         0
  ],
  [
    0.828125,   0.84375, 0.8984375,      0.25,     0.875, 0.8984375,  0.796875,
        0.25,  0.671875,      0.25, 0.7890625, 0.8046875,      0.25,  0.890625,
        0.25,  0.765625,  0.890625,    0.8125,  0.921875, 0.8203125, 0.7890625,
        0.25, 0.8984375, 0.7578125, 0.9296875, 0.8984375, 0.8984375,  0.921875,
    0.796875,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0,         0,         0,         0,         0,         0,
           0,         0
  ],
  [
    0.5859375, 0.6640625,  0.359375,      0.25,  0.046875,  1.046875, 1.8984375,
    1.1796875,   1.40625, 0.4609375, 0.2734375, 0.5390625, 0.5859375,   1.59375,
    1.5234375,  0.890625, 0.8515625,  1.046875,  1.296875, 1.3671875, 1.5859375,
            1, 0.7734375,  1.828125, 0.9609375,  0.609375, 0.3828125, 1.0234375,
    1.3515625,  0.390625, 1.4140625, 0.1328125,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ],
  [
    0.4296875, 0.3828125,  0.765625, 0.3828125,  0.421875, 0.4453125,
     0.765625,  0.765625,     0.375,  0.765625,   0.40625, 0.4140625,
     0.390625, 0.4140625, 0.7890625, 0.3984375,  0.390625,  0.390625,
    0.3828125, 0.4453125, 0.3984375,   0.78125,   0.40625, 0.4140625,
    0.4140625, 0.4140625, 0.4140625, 0.4453125, 0.3984375,  0.765625,
    0.7890625, 0.7890625, 0.3828125,  0.421875, 0.4296875, 0.7734375,
      0.78125, 0.4453125, 0.4453125,  0.421875,  0.421875,   0.40625,
    0.3828125,    0.4375, 0.4140625, 0.3828125,  0.390625,  0.421875,
     0.390625, 0.7734375,  0.390625,  0.421875, 0.7890625,   0.40625,
     0.796875, 0.3828125, 0.4453125,   0.40625,  0.390625,  0.390625,
    0.4140625, 0.4296875,     0.375, 0.4296875,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,
            0,         0,         0,         0
  ],
  [
     0.765625,     0.375,   0.78125, 0.4296875, 0.4296875,     0.375,   0.78125,
      0.40625,    0.4375, 0.7890625,  0.765625, 0.7734375,  0.421875, 0.4296875,
      0.40625, 0.4296875,  0.796875, 0.4296875,  0.796875,   0.40625, 0.4140625,
       0.4375,    0.4375, 0.4140625,     0.375,   0.78125, 0.4296875,  0.390625,
     0.421875,  0.421875,  0.765625, 0.4296875, 0.4140625, 0.7734375, 0.4140625,
    0.4296875,  0.796875,    0.4375,     0.375, 0.7734375,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ],
  [
     0.421875,  0.796875,  0.796875,  0.765625, 0.3984375, 0.3984375,    0.4375,
    0.4453125,   0.78125,  0.390625, 0.4140625, 0.7890625, 0.7734375, 0.4296875,
     0.765625,  0.796875,     0.375, 0.3984375, 0.7890625,     0.375, 0.4296875,
    0.4140625, 0.3984375, 0.7578125, 0.3828125,  0.390625, 0.4296875, 0.4140625,
    0.7890625, 0.3984375,  0.796875,   0.40625,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ],
  [
      0.78125,  0.390625,    0.8125, 0.4140625, 0.5703125,    0.5625,   0.84375,
      0.84375, 0.7734375, 0.9453125,  0.515625,  0.578125, 0.5703125, 0.5546875,
     0.546875,   0.90625, 0.5703125, 0.5546875, 0.5390625, 0.8046875,  0.765625,
    0.8515625,  0.671875, 0.3828125, 0.7734375, 0.8515625, 0.4453125, 0.9140625,
    0.5703125, 0.5546875,  0.671875, 0.9140625, 0.7578125, 0.8515625, 0.4453125,
    0.4140625,  0.703125,    0.6875, 0.5703125, 0.4765625,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ],
  [
       0.6875, 0.3671875,   0.96875, 0.3515625,   0.96875, 0.6953125,     0.25,
    0.6953125, 0.3984375, 0.4140625,      0.25, 0.2578125,      0.25,  0.40625,
      0.96875,  0.671875,   0.96875,      0.25,   0.40625,      0.25,  0.96875,
      0.96875, 0.3984375,    0.3125, 0.7421875, 0.3203125,   0.96875, 0.390625,
        0.375,   0.96875,   0.96875,      0.25, 0.3984375,   0.96875,  0.96875,
     0.578125,     0.375, 0.6953125, 0.3984375,   0.96875,  0.390625,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0,         0,         0,         0,         0,        0,
            0,         0
  ],
  [
     0.359375, 0.3515625, 0.3515625,      0.25,  0.359375,  0.359375,
     0.359375,  0.359375,      0.25, 0.3515625,  0.359375, 0.3515625,
    0.3515625,      0.25, 0.3671875,      0.25, 0.3515625,  0.359375,
    0.3515625, 0.3515625,      0.25,  0.359375,      0.25,  0.359375,
     0.359375,  0.359375,      0.25, 0.3671875,      0.25,  0.359375,
     0.359375,      0.25, 0.3671875,      0.25,  0.359375, 0.3515625,
         0.25, 0.3515625, 0.3515625,      0.25, 0.3671875,      0.25,
     0.359375, 0.3515625,      0.25, 0.3671875,      0.25, 0.3515625,
     0.359375,      0.25,  0.359375,      0.25,  0.359375,  0.359375,
    0.3515625,      0.25,  0.359375, 0.3515625,  0.359375,      0.25,
    0.3515625, 0.3515625, 0.3515625,      0.25, 0.3515625,  0.359375,
         0.25, 0.3671875,      0.25,  0.359375,      0.25, 0.3515625,
     0.359375,      0.25,  0.359375, 0.3515625, 0.3515625, 0.3515625,
         0.25, 0.3515625, 0.3515625, 0.3515625,      0.25, 0.3515625,
     0.359375, 0.3515625, 0.3515625,      0.25,  0.359375,      0.25,
     0.359375, 0.3515625,  0.359375,         0,         0,         0,
            0,         0,         0,         0
  ],
  [
    0.3828125, 0.3828125, 0.3828125,     0.375, 0.3828125, 0.3828125,
    0.3828125, 0.3828125, 0.3828125,     0.375, 0.3828125,     0.375,
        0.375,     0.375, 0.3828125, 0.3828125, 0.3828125, 0.3828125,
        0.375,     0.375, 0.3828125, 0.3828125,     0.375,     0.375,
        0.375,     0.375,     0.375, 0.3828125, 0.3828125, 0.3828125,
    0.3828125,     0.375,     0.375, 0.3828125, 0.3828125, 0.3828125,
        0.375,     0.375, 0.3828125,     0.375, 0.3828125, 0.3828125,
    0.3828125, 0.3828125,     0.375,     0.375, 0.3828125, 0.3828125,
    0.3828125,     0.375,     0.375,     0.375,     0.375,     0.375,
    0.3828125,     0.375,     0.375, 0.3828125,     0.375,     0.375,
    0.3828125, 0.3828125,     0.375,     0.375,     0.375,     0.375,
        0.375, 0.3828125, 0.3828125,     0.375,     0.375,     0.375,
        0.375, 0.3828125, 0.3828125, 0.3828125,     0.375, 0.3828125,
    0.3828125,     0.375, 0.3828125, 0.3828125,     0.375,     0.375,
        0.375,     0.375,     0.375, 0.3828125, 0.3828125,     0.375,
        0.375,     0.375,     0.375, 0.3828125, 0.3828125,     0.375,
        0.375,     0.375,     0.375,     0.375
  ],
  [
    0.9296875,    0.8125, 0.9453125,      0.25, 0.9453125, 0.7890625, 0.8984375,
         0.25, 0.5703125,      0.25, 0.7578125, 0.8515625,      0.25, 0.7578125,
         0.25,  0.859375, 0.7890625, 0.9140625,  0.890625, 0.8671875,  0.859375,
         0.25, 0.7890625,  0.859375,  0.828125, 0.8671875, 0.9453125, 0.7890625,
     0.890625,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0,         0,         0,         0,         0,         0,
            0,         0
  ]
])
  result = model.predict(tests)
  result.print()
}

run()

/*
Logs:
Accuracy metric isn't too important, since it is limited in scope
Validation loss prioritized over training loss since overfitting is a risk
Attempt 0 Validation Loss
  Validation dataset was changed after Epoch 1
  Epoch 2: 0.020152157172560692
  Epoch 3: 0.021221986040472984
  Epoch 4: 0.019274786114692688
  Epoch 5: 0.01808619312942028
  Epoch 6: 0.01789235696196556
  Epoch 7: 0.018380405381321907
  Epoch 8: 0.018724314868450165
  Epoch 9: 0.017590492963790894
  Epoch 10: 0.017296183854341507
  Epoch 11: 0.017258295789361
  Epoch 12: 0.01692485436797142
  Epoch 13: 0.016647960990667343
  Epoch 14: 0.017300564795732498
  Epoch 15: 0.01718231663107872
  Epoch 16: 0.01688435673713684
  Epoch 17: 0.017126111313700676
  Epoch 18: 0.0169396810233593
  Epoch 19: 0.017037922516465187
  Epoch 20: 0.016512077301740646
  Epoch 21: 0.01678658276796341
    Epoch 22: 0.01647314429283142
  Epoch 23: 0.016895746812224388
  Epoch 24: 0.01680358685553074

dataset_builder.js was modified to produce a less confusing dataset
Attempt 1:
  Epoch 0: 0.022269491106271744
  Epoch 1: 0.018839053809642792
  Modified dataset to contain more classes which NN was silent on
  Epoch 2: 0.03164568170905113
  Epoch 3: 0.03153269365429878
  Epoch 4: 0.03063458576798439
  Epoch 5: 0.029074309393763542
  Epoch 6: 0.031424716114997864
  Epoch 7: 0.029588978737592697
  Epoch 8: 0.027455825358629227
  Epoch 9: 0.03125842660665512
  Epoch 10: 0.028336305171251297
  Epoch 11: 0.032599423080682755
  Epoch 12: 0.02750863879919052
  Epoch 13: 0.02762567810714245
  Epoch 14: 0.02729250118136406
  Modified dataset to contain more Caesar, Vigenere, Base64 datapoints
  Epoch 15: 0.03487705439329147
  Epoch 16: 0.037978798151016235
  Epoch 17: 0.035137418657541275
  Epoch 18: 0.0348610058426857
  Epoch 19: 0.03891283646225929
  Epoch 20: 0.03651105612516403
  Epoch 21: 0.0365649089217186
  Epoch 22: 0.03399867191910744
  Epoch 23: 0.03623398393392563
  Epoch 24: 0.034643612802028656
    Epoch 25: 0.03381890803575516
  Epoch 26: 0.034574560821056366
  Epoch 27: 0.03658789396286011
  Epoch 28: 0.03397428244352341
  Epoch 29: 0.03610017150640488
    Epoch 30: 0.03338736668229103  SHA256 seems to be silent, don't use
  Epoch 31: 0.035528525710105896
  Epoch 32: 0.03449361398816109
 */