"use strict"

const fs = require('fs')
const encryptor = require('./encrypt')
const decryptor = require('./decrypt')

// All possible algorithms
const algos = ["Caesar","Vigenere","Blowfish","SHA256","SHA1","MD5","Base64","Leet","Morse","Binary"]

// Possible algorithms that can (incorrectly) decrypt a string
const can_dec = ["Caesar","Vigenere","Blowfish","Base64","Leet"]
// Algorithms that require a key
const key_req = ["Caesar","Vigenere","Blowfish"]

function keyGen(algo) {
  const words = [
    'the',
    'DoD',               'released',
    'guidance',          'called',        'Department',
    'of',                'Defense',       'Strategy',
    'for',               'Operating',     'in',
    'Cyberspace',        'which',         'articulated',
    'five',              'goals',         'to',
    'treat',             'cyberspace',    'as',
    'an',                'operational',   'domain',
    'employ',            'new',           'defensive',
    'concepts',          'protect',       'networks',
    'and',               'systems',       'partner',
    'with',              'other',         'agencies',
    'private',           'sector',        'pursuit',
    'wholeofgovernment', 'cybersecurity', 'work',
    'international',     'allies',        'support',
    'collective',        'development',   'cyber',
    'workforce',         'capable',       'rapid',
    'technological',     'innovation'
  ]
  switch (algo) {
    case "Caesar":
      return Math.floor(Math.random() * 26)
    case "Vigenere":
      return words[Math.floor(Math.random() * words.length)]
    case "Blowfish":
      return words[Math.floor(Math.random() * words.length)]
    default:
      return ''
  }
}

// Expected output of neural network
function createLabel(algo) {
  const algos = ["Caesar","Vigenere","Blowfish","SHA256","SHA1","MD5","Base64","Leet","Morse","Binary","English"]
  var label = Array(11).fill(0)
  if (algos.includes(algo)) label[algos.indexOf(algo)] = 1
  return label
}

function decrypt(msg, a_used) {
  var incorrect = []
  for (const a of can_dec) {
    // Do not reapply same algorithm (even if key could be different)
    if (a == a_used) continue
    // Do not apply shift ciphers (may confuse neural network)
    if (["Caesar","Vigenere"].includes(a)) continue
    
    try {
      incorrect = incorrect.concat(decryptor.decrypt(a, msg, keyGen(a)))
    } catch (error) {
      //console.log(error)
    }
  }
  return incorrect
}

function tensorize(msg) {
  msg = msg.slice(0, 100)
  var code = []
  for (const c of msg) code.push(c.charCodeAt(0) / 128)
  while (code.length < 100) code.push(0)
  return code
}

const contents = fs.readFileSync('text.json', 'utf8')
const lines = JSON.parse(contents)

var dataset = []


// Pad dataset with English sentences to encourage false positives rather than false negatives
const words = lines.join(' ').split(/\s/g)
for (var lp = 0; lp < words.length - 1; lp++) {
  for (var rp = lp + 1; rp < words.length; rp += 2) {
    var segment = words.slice(lp, rp).join(' ')
    if (segment.length > 80) break
    if (rp % 3 == 0) segment = segment.toLowerCase()
    if (rp % 5 == 0) {
      // Algorithms that the NN seems to be silent on
      for (const a of ["Caesar","Vigenere","Leet","Base64"]) {
        const possibilities = encryptor.encrypt(a, segment, keyGen(a))
        for (const poss of possibilities) {
          dataset.push({ val: tensorize(poss), label: createLabel(a) })
        }
      }
    }
    dataset.push({ val: tensorize(segment), label: createLabel("English") })
  }
}

for (const l of lines) {
  console.log(lines.indexOf(l))
  // Register line as english
  dataset.push({ val: tensorize(l), label: createLabel("English") })
  
  for (const a1 of algos) {
    // Register ciphertext
    const possibilities = encryptor.encrypt(a1, l, keyGen(a1))
    for (const poss of possibilities) {
      dataset.push({ val: tensorize(poss), label: createLabel(a1) })

      // Register incorrect strings
      const incorrect = decrypt(poss, a1)
      if (incorrect.length) {
        var inc = incorrect[Math.floor(Math.random() * incorrect.length)]
        dataset.push({ val: tensorize(inc), label: createLabel('') })
      }

      // Second layer of encryption
      for (const a2 of algos) {
        const possibilities2 = encryptor.encrypt(a2, poss, keyGen(a2))
        for (const poss2 of possibilities2) {
          if (poss2 == poss) continue
          dataset.push({ val: tensorize(poss2), label: createLabel(a2) })
        }
      }
    }
  }
}

// Durstenfeld shuffle
for (let i = dataset.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1))
  var temp = dataset[i];
  dataset[i] = dataset[j];
  dataset[j] = temp;
}

console.log(dataset.length)
dataset = JSON.stringify(dataset)
dataset = dataset.replace(/{/g, '{\n')
dataset = dataset.replace(/}/g, '\n}')
console.log(dataset.substring(0, 2000))

fs.writeFile('do_not_touch_databomb/dataset.json', dataset, (err) => { console.log(err) })