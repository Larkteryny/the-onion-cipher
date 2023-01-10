module.exports.decrypt = decrypt

const bf = require('javascript-blowfish')
const tf = require('@tensorflow/tfjs-node')

// Load model
var model;
tf.loadLayersModel("file://./model/model.json")
  .then(value => {
    model = value
  })

// "Dictionary" of functions to call for each algorithm
var algos = {
  "Caesar": caesar,
  "Vigenere": vigenere,
  "Blowfish": blowfish,
  "SHA256": sha256,
  "SHA1": sha1,
  "MD5": md5,
  "Base64": b64,
  "Leet": leet,
  "Morse": morse,
  "Binary": binary,
}
// Corresponding to NN model output
const languages = ["Caesar","Vigenere","Blowfish","SHA256","SHA1","MD5","Base64","Leet","Morse","Binary","English"]

function insort(a, val) {
  // Maintain priority queue structure
  for (let i in a) {
    if (val.confidence > a[i].confidence) {
      a.splice(i, 0, val)
      return a
    }
  }
  a.push(val)
  return a
}

// Convert a string into valid input for NN model
function tensorize(msg) {
  msg = msg.slice(0, 100)
  var code = []
  for (const c of msg) code.push(c.charCodeAt(0) / 128)
  while (code.length < 100) code.push(0)
  return tf.tensor([code])
}

async function decrypt(msg, keys) {
  console.log("decrypt function called")

  // Break out of loops
  var counter = 0
  
  // Results to give to the user
  var results = []
  // Priority queue of text to decrypt
  // {confidence: Double, algo: String, text: String, steps: [String]}
  var possibilities = []
  // Populate initial possibilities
  var guesses = model.predict(tensorize(msg)).arraySync()[0]
  console.log(guesses)
  for (const guess in guesses) {
    if (guesses[guess] === 0) continue
    var new_poss = {}
    new_poss.confidence = guesses[guess]
    new_poss.algo = languages[guess]
    console.log(guesses[guess], languages[guess])
    new_poss.text = msg
    new_poss.steps = []
    // Add to possibilities list
    insort(possibilities, new_poss)
  }
  
  while (results.length < 3 && possibilities.length && counter < 1000) {
    const poss = possibilities.shift()
    counter += 1
    if (poss.algo === "English") {
      insort(results, poss)
      continue
    }

    var decs
    try {decs = algos[poss.algo](poss.text, keys, model)}
    catch (error) { console.log(error) } // NN model was wrong, move on

    if (decs.length === 0) { // Deadend
      insort(results, poss)
    }
    for (const msg of decs) {
      if (msg.text === poss.text) continue
      
      // Feed to NN model
      const guesses = model.predict(tensorize(msg.text)).arraySync()[0]
      if (poss.algo == "Blowfish") console.log("blowfish", guesses)
      for (const guess in guesses) {
        if (guesses[guess] === 0) continue
        var new_poss = {}
        new_poss.confidence = guesses[guess]
        new_poss.algo = languages[guess]
        new_poss.text = msg.text
        // Add current step to list of steps
        new_poss.steps = [...poss.steps] // Clone steps list
        var this_step = msg.step
        this_step.algo = poss.algo
        new_poss.steps.push(this_step)
        // Add to possibilities list
        insort(possibilities, new_poss)
      }
    }
  }
  
  return results
}


/*
All functions have interface:
@param {String} msg - the ciphertext to decrypt
@param {[String]} keys - possible keys
@returns {[{String: Any}]} possible decrypted texts and important corresponding info
*/


// Decryption
function caesar(msg, keys, model) {
  // Possible alphabets
  const alphasets = [
    ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"],
    ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ", "0123456789"],
    ["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"],
    ["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"],
    ["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"],
  ]

  function cipher(c, key, alphaset) {
    for (const a of alphaset) {
      if (a.includes(c)) return a[(a.indexOf(c) - key + 3*a.length) % a.length]
    }
    return c
  }

  var possibilities = []
  for (const alphaset of alphasets) {
    for (const key of keys) {
      const k = parseInt(key)
      if (typeof(k) == "undefined") continue
      
      var new_msg = ""
      for (const c of msg) {
        new_msg += cipher(c, k, alphaset)
      }
      possibilities.push({ "text": new_msg, "step": { "key": k, "alphabets": alphaset }})
    }
  }

  // TODO: filter possibilities
  possibilities = possibilities.splice(0, 2)
  
  return possibilities
}

function vigenere(msg, keys, model) {
  const alphabet_l = "abcdefghijklmnopqrstuvwxyz" // Numbers and symbols ignored
  const alphabet_u = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" 

  function cipher(c, key) {
    if (alphabet_l.includes(c)) {
      return [alphabet_l[(alphabet_l.indexOf(c) - key + 26) % 26], 1]
    } else if (alphabet_u.includes(c)) {
      return [alphabet_u[(alphabet_u.indexOf(c) - key + 26) % 26], 1]
    } else {
      return [c, 0]
    }
  }

  // Attempt to decrypt with all user provided keys
  var possibilities = []
  for (const key of keys) {
    // Check if key is valid, only containing letters
    if (key.toLowerCase().match(/[^a-z]/g)) continue
    
    var k = []
    for (const c of key.toUpperCase()) k.push(alphabet_u.indexOf(c))
    var new_msg = ""

    var k_i = 0
    for (const c of msg) {
      k_i %= k.length
      const result = cipher(c, k[k_i])
      new_msg += result[0]
      k_i += result[1]
    }
    possibilities.push({ "text": new_msg, "step": { "key": key, "alphabets": [alphabet_l, alphabet_u] }})
  }

  return possibilities
}

function blowfish(msg, keys, model) {
  var msgs = [msg]
  try {
    var blowfish = bf.Blowfish('')
    msg.push(blowfish.base64Decode(msg))
  } catch(e) {} // Ignore
  
  possibilities = []
  for (const key of keys) {
    var blowfish = new bf.Blowfish(key)
    for (msg of msgs) {
      try {
        var new_msg = blowfish.decryptECB(msg)
        possibilities.push({ "text": new_msg, "step": { "key": key }})
      } catch(e) {} // Ignore
    }
  }
  console.log(possibilities)
  return possibilities
}

// Dehashing
// All deadends
function sha256(msg, keys, model) {
  return []
}

function sha1(msg, keys, model) {
  return []
}

function md5(msg, keys, model) {
  return []
}


// Decoding
function b64(msg, keys, model) {
  // Conforms msg length to multiple of 4 for atob function
  msg = msg.trim().replace(/=+$/, '')
  if (msg.length % 4) msg += '='.repeat(4 - msg.length % 4)
  
  return [{ "text": atob(msg), "step": {} }]
}

function leet(msg, keys, model) {
  // Will replace almost all punctuation and numbers, result will be all lowercase
  // Extremely destructive, likely to stump analysis
  const swap = [['\\_:_/', 'w'], ['\\_|_/', 'w'], ['/\\/\\', 'm'], ['|\\/|', 'm'], ['(_,)', 'q'], ['\\/\\/', 'w'], ['/-\\', 'a'], ['|-\\', 'a'], ['(_+', 'g'], ['(-)', 'h'], [')-(', 'h'], ['/-/', 'h'], [':-:', 'h'], ['[-]', 'h'], [']-[', 'h'], [']~[', 'h'], ['|-|', 'h'], ['|~|', 'h'], ['/V\\', 'm'], ['|V|', 'm'], ['/\\/', 'n'], ['[\\]', 'n'], ['|\\|', 'n'], ['()_', 'q'], ['(_)', 'u'], ['|_|', 'u'], ['\\V/', 'w'], ['\\X/', 'w'], ['\\^/', 'w'], ['\\|/', 'w'], ['/\\', 'a'], ['[)', 'd'], ['|)', 'd'], ['|>', 'd'], ['|]', 'd'], ['[-', 'e'], ['/=', 'f'], ['|=', 'f'], ['}{', 'h'], ['_/', 'j'], ['_|', 'j'], ['|<', 'k'], ['|{', 'k'], ['1_', 'l'], ['[_', 'l'], ['|_', 'l'], ['()', 'o'], ['[]', 'o'], ['/*', 'p'], ['|*', 'p'], ['|o', 'p'], ['<|', 'q'], ['/2', 'r'], ['|2', 'r'], ['|?', 'r'], ['\\/', 'v'], ['|/', 'v'], ['vv', 'w'], [')(', 'x'], ['><', 'x'], ['`/', 'y'], ['>_', 'z'], ['4', 'a'], ['@', 'a'], ['8', 'b'], ['(', 'c'], ['<', 'c'], ['[', 'c'], ['3', 'e'], ['6', 'g'], ['#', 'h'], ['!', 'i'], [':', 'i'], [']', 'i'], [';', 'j'], ['1', 'l'], ['|', 'l'], ['0', 'o'], ['2', 'r'], ['$', 's'], ['5', 's'], ['7', 't'], ['A', 'a'], ['B', 'b'], ['C', 'c'], ['D', 'd'], ['E', 'e'], ['F', 'f'], ['G', 'g'], ['H', 'h'], ['I', 'i'], ['J', 'j'], ['K', 'k'], ['L', 'l'], ['M', 'm'], ['N', 'n'], ['O', 'o'], ['P', 'p'], ['Q', 'q'], ['R', 'r'], ['S', 's'], ['T', 't'], ['U', 'u'], ['V', 'v'], ['W', 'w'], ['X', 'x'], ['Y', 'y'], ['Z', 'z']]
  for (const code of swap) {
    msg = msg.replaceAll(code[0], code[1])
  }
  return [{ "text": msg, "step": {} }]
}

function morse(msg, keys, model) {
  // Ability to work with other standards
  msg = msg.trim()
  msg = msg.replaceAll('_', '-')
  msg = msg.replaceAll(/\s\|\s|\|/g, ' / ') // Regex to replace ' | ' and '|' with ' / '
  
  var msgs = [msg]
  if ((msg.match(/\s/g) || []).length >= (msg.match(/[-\.]/g) || []).length) {
    // Standard where each note is separated by a space
    msg = msg.replaceAll(/-\s/g, '-')
    msg = msg.replaceAll(/\.\s/g, '.')
    msg = msg.replaceAll('  ', ' ') // Assumes that each encoded character is sep. by 3 spaces
    msg = msg.replaceAll(/\s\s+/g, ' / ')
    msgs.push(msg)
  }
  
  const swap = {'/': ' ', '.-': 'a', '-...': 'b', '-.-.': 'c', '-..': 'd', '.': 'e', '..-.': 'f', '--.': 'g', '....': 'h', '..': 'i', '.---': 'j', '-.-': 'k', '.-..': 'l', '--': 'm', '-.': 'n', '---': 'o', '.--.': 'p', '--.-': 'q', '.-.': 'r', '...': 's', '-': 't', '..-': 'u', '...-': 'v', '.--': 'w', '-..-': 'x', '-.--': 'y', '--..': 'z', '-----': '0', '.----': '1', '..---': '2', '...--': '3', '....-': '4', '.....': '5', '-....': '6', '--...': '7', '---..': '8', '----.': '9', '-.-.--': '!', '.--.-.': '@', '.-...': '&', '...-..-': '$', '-.--.': '(', '-.--.-': ')', '.-.-.': '+', '-....-': '-', '-...-': '=', '---...': ':', '.-..-.': '"', '.----.': "'", '..--..': '?', '--..--': ',', '.-.-.-': '.', '-..-.': '/', '-.-.-.': ';', '..--.-': '_'}
  var possibilities = []
  for (const m of msgs) {
    var new_msg = ''
    for (const c of m.split(' ')) {
      if (c in swap) new_msg += swap[c]
      else new_msg += c
    }
    new_msg = new_msg.replaceAll('0/0', '%') // % is encoded as 0/0 in Morse, unlikely that user intended 0/0
    possibilities.push({ "text": new_msg, "step": {} })
  }
  return possibilities
}

function binary(msg, keys, model) {
  msg = msg.trim()
  
  // Standardize to 0 and 1
  var chars = new Set(msg)
  chars.delete(' ')
  chars = Array.from(chars)
  if (chars.length < 1) chars.push('')
  var msgs = ['', '']
  for (const c of msg) {
    if (c === chars[0]) {
      msgs[0] += '1'; msgs[1] += '0'
    } else if (c === chars[1]) {
      msgs[0] += '0'; msgs[1] += '1'
    } else if (c === ' ') {
      msgs[0] += ' '; msgs[1] += ' '
    } else {
      throw new Error('msg contains more than 2 unique characters')
      return []
    }
  }

  var possibilities = []
  for (var msg of msgs) {
    if (msg.includes(' ')) msg = msg.split(' ')
    else msg = msg.match(/.{8}|.{1,7}/g)
    var new_msg = ""
    for (const seg of msg) {
      new_msg += String.fromCharCode(parseInt(seg, 2))
    }
    possibilities.push({ "text": new_msg, "step": {} })
  }
  return possibilities
}