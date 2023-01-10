# The Onion Cipher

This repo contains files for a website offering multiple layers of encryption, featuring 10 of some of the most commonly used algorithms from encryption, to hashing, to encoding. Multi-step decryption is also provided, driven by a neural network behind the scenes. The website can be accessed via Replit [here](https://theonioncipher.ethan11111.repl.co/).

For the encryption half, users can assemble a stack of algorithms, and drag and drop to rearrange. Upon entering their message and hitting "Encrypt", their message will be run through the selected algorithms from top to bottom.

For the decryption half, the user can enter an encrypted message and any keys known to them. They will then receive a list of possible decrypted messages, along with the neural network's confidence and the steps taken to unwrap each message.

This was a hackathon submission for Maple x Tommy Hacks 2023.

## Dependencies
*Node.js
*Express JS
*TensorFlow.js for Node.js
*javascipt-blowfish

## Other info
The text used to generate the dataset was accessed from this [Wikipedia article about cybersecurity regulations](https://en.wikipedia.org/wiki/Cyber-security_regulation).

The NN model used is a duplicate of model-train/checkpoints/attempt1/checkpoint26/

dataset.json is empty in this repo, due to its size exceeding Github's limits and because dataset_builder.js has randomization each time it is run anyway.

To add plaintext to enlarge the dataset:
1.Append the plaintext into model-train/text.txt
2.Run model-train/text_normalizer.js
3.Overwrite model-train/text.txt with contents of model-train/texttemp.txt
4.Run model-train/json_builder.js
5.Run model-train/dataset_builder.js to generate new dataset
