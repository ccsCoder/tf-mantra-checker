// Training Code...
let model;
const vocab = "abcdefghijklmnopqrstuvwxyz ".split("");

document.addEventListener("DOMContentLoaded", async () => {
  console.log("Start training...");
  await trainModel();
  console.log("Training complete!");
});

// Convert text to one-hot encoded vectors
function textToTensor(text) {
  const lowered = text.toLowerCase();
  const vectors = [];

  for (let char of lowered) {
    const vector = new Array(vocab.length).fill(0);
    const index = vocab.indexOf(char);
    if (index !== -1) {
      vector[index] = 1;
    }
    vectors.push(vector);
  }

  // Pad or truncate to 20 characters
  while (vectors.length < 20) {
    vectors.push(new Array(vocab.length).fill(0));
  }
  vectors.length = 20;

  return tf.tensor2d([vectors.flat()]);
}

// Create and train the model
async function trainModel() {
  // const status = document.getElementById("status");
  // status.className = "";
  // status.textContent = "Training...";

  // const targetPhrase = document.getElementById("targetPhrase").value;
  const targetPhrase = "om namah shivay";

  // Create a simple neural network
  model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [20 * vocab.length],
      units: 128,
      activation: "relu",
    })
  );
  model.add(
    tf.layers.dense({
      units: 1,
      activation: "sigmoid",
    })
  );

  model.compile({
    optimizer: "adam",
    loss: "binaryCrossentropy",
    metrics: ["accuracy"],
  });

  // Generate training data
  const trainingData = [];
  const trainingLabels = [];

  // Positive examples (variations of target phrase)
  for (let i = 0; i < 50; i++) {
    trainingData.push(targetPhrase);
    trainingLabels.push(1);
  }

  // Negative examples (random strings)
  for (let i = 0; i < 50; i++) {
    let randomPhrase = "";
    const length = Math.floor(Math.random() * 10) + 5;
    for (let j = 0; j < length; j++) {
      randomPhrase += vocab[Math.floor(Math.random() * vocab.length)];
    }
    trainingData.push(randomPhrase);
    trainingLabels.push(0);
  }

  // Convert to tensors
  const xs = tf.concat(trainingData.map((text) => textToTensor(text)));
  const ys = tf.tensor2d(trainingLabels, [trainingLabels.length, 1]);

  // Train the model
  await model.fit(xs, ys, {
    epochs: 20,
    shuffle: true,
  });

  // status.textContent = "Training complete!";
  // status.className = "success";
}

// Test a phrase using the trained model
async function testPhrase(testPhrase) {
  // const status = document.getElementById("status");

  if (!model) {
    alert("Please train the model first!");
    // status.className = "error";
    return;
  }

  // const testPhrase = document.getElementById("testPhrase").value;
  const inputTensor = textToTensor(testPhrase);
  const prediction = await model.predict(inputTensor).data();
  const confidence = Math.round(prediction[0] * 100);

  // status.textContent = `Confidence that this matches the target phrase: ${confidence}%`;
  // status.className = confidence > 50 ? "success" : "error";
  return confidence;
}
