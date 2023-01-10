module.exports.encrypt = encrypt

const crypto = require('node:crypto')
const bf = require('javascript-blowfish')

// "Dictionary" of functions to call for each algorithm
const algos = {
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

// Main encryption function
function encrypt(algo, msg, key) {
  return algos[algo](msg, key)
}

// Encryption algorithms
function caesar(msg, key) {
  key %= 26
  
  const alphabet_l = "abcdefghijklmnopqrstuvwxyz" // Numbers and symbols ignored
  const alphabet_u = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  var new_msg1 = "", new_msg2 = ""
  for (const c of msg) {
    if (alphabet_l.includes(c)) {
      new_msg1 += alphabet_l[(alphabet_l.indexOf(c) + key + 26) % 26]
      new_msg2 += alphabet_u[(alphabet_u.indexOf(c) + key + 26) % 26]
    } else if (alphabet_u.includes(c)) {
      new_msg1 += alphabet_u[(alphabet_u.indexOf(c) + key + 26) % 26]
      new_msg2 += alphabet_l[(alphabet_l.indexOf(c) + key + 26) % 26]
    } else {
      new_msg1 += c
      new_msg2 += c
    }
  }

  return [new_msg1, new_msg2]
}

function vigenere(msg, key) {
  const alphabet_l = "abcdefghijklmnopqrstuvwxyz" // Numbers and symbols ignored
  const alphabet_u = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" 
  
  var k = []
  for (const c of key.toUpperCase()) k.push(alphabet_u.indexOf(c))
  var new_msg1 = "", new_msg2 = ""

  var k_i = 0
  for (const c of msg) {
    k_i %= k.length
    if (alphabet_l.includes(c)) {
      new_msg1 += alphabet_l[(alphabet_l.indexOf(c) + k[k_i]) % 26]
      new_msg2 += alphabet_l[(alphabet_l.indexOf(c) + k[k_i] + 3) % 26]
      k_i++
    } else if (alphabet_u.includes(c)) {
      new_msg1 += alphabet_u[(alphabet_u.indexOf(c) + k[k_i]) % 26]
      new_msg2 += alphabet_u[(alphabet_u.indexOf(c) + k[k_i] + 3) % 26]
      k_i++
    } else {
      new_msg1 += c
      new_msg2 += c
    }
  }

  return [new_msg1, new_msg2]
}

function blowfish(msg, key) {
  var blowfish = new bf.Blowfish(key)
  return [blowfish.encryptECB(msg)]
}

// Hash algorithms
// Undergo a conversion to hex
function sha256(msg, key) {
  const hash = crypto.createHash('sha256') // New one must be created each time
  hash.update(msg)
  msg = hash.digest('hex')
  return [msg]
}

function sha1(msg, key) {
  const hash = crypto.createHash('sha1') // New one must be created each time
  hash.update(msg)
  msg = hash.digest('hex')
  return [msg]
}

function md5(msg, key) {
  const hash = crypto.createHash('md5') // New one must be created each time
  hash.update(msg)
  msg = hash.digest('hex')
  return [msg]
}

// Encoding algorithms
function b64(msg, key) {
  msg = btoa(msg)
  var possibilities = [msg]
  // Pad dataset with Base64
  if (Math.random() > 0.4) possibilities.push(msg.replaceAll('=', ''))
  return possibilities
}

function leet(msg, key) {
  msg = msg.toLowerCase()
  
  const base_swap = [['a', '4'], ['b', '8'], ['c', '('], ['d', 'D'], ['e', '3'], ['f', 'F'], ['g', '6'], ['h', '|-|'], ['i', '!'], ['j', 'J'], ['k', '|<'], ['l', '1'], ['m', '|V|'], ['n', '|\\|'], ['o', '0'], ['p', 'P'], ['q', 'Q'], ['r', '|2'], ['s', '5'], ['t', '7'], ['u', '(_)'], ['v', '\\/'], ['w', '\\X/'], ['x', '><'], ['y', 'Y'], ['z', 'Z']]
  var swaps = [base_swap]
  for (var _ = 0; _ < 3; _++) {
    var swap = []
    for (const code of base_swap) swap.push([].concat(code))
    
    for (var _ = 0; _ < 4; _++) {
      var replace = Math.floor(Math.random() * swap.length)
      if (swap[replace][0].toUpperCase() === swap[replace][0]) swap.splice()
    }
  }
  
  var possibilities = []
  for (const swap of swaps) {
    for (const code of swap) msg = msg.replaceAll(code[0], code[1])
    possibilities.push(msg)
  }
  return possibilities
}

function morse(msg, key) {
  // No standard for: #^*{}[]|\<>
  const swap = {' ': '/ ', 'A': '.- ', 'B': '-... ', 'C': '-.-. ', 'D': '-.. ', 'E': '. ', 'F': '..-. ', 'G': '--. ', 'H': '.... ', 'I': '.. ', 'J': '.--- ', 'K': '-.- ', 'L': '.-.. ', 'M': '-- ', 'N': '-. ', 'O': '--- ', 'P': '.--. ', 'Q': '--.- ', 'R': '.-. ', 'S': '... ', 'T': '- ', 'U': '..- ', 'V': '...- ', 'W': '.-- ', 'X': '-..- ', 'Y': '-.-- ', 'Z': '--.. ', '0': '----- ', '1': '.---- ', '2': '..--- ', '3': '...-- ', '4': '....- ', '5': '..... ', '6': '-.... ', '7': '--... ', '8': '---.. ', '9': '----. ', '!': '-.-.-- ', '@': '.--.-. ', '&': '.-... ', '$': '...-..- ', '(': '-.--. ', ')': '-.--.- ', '+': '.-.-. ', '-': '-....- ', '=': '-...- ', ':': '---... ', '"': '.-..-. ', "'": '.----. ', '?': '..--.. ', ',': '--..-- ', '.': '.-.-.- ', '/': '-..-. ', ';': '-.-.-. ', '_': '..--.- ', '%': '----- -..-. ----- '}
  msg = msg.toUpperCase()
  var new_msg = ""
  // replaceAll cannot be used as period and hyphen contain each other when encoded
  for (const c of msg) {
    if (c in swap) new_msg += swap[c]
    else new_msg += c + ' '
  }
  new_msg = new_msg.substring(0, new_msg.length - 1) // Remove trailing whitespace
  possibilities = [new_msg]
  possibilities.push(new_msg.replaceAll('-', '_'))
  if (new_msg.includes('/')) possibilities.push(new_msg.replaceAll('/', '|'))
  return possibilities
}

function binary(msg, key) {
  new_msg = "";
  for (const c of msg) new_msg += c.charCodeAt(0).toString(2)
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz23456789-=_+;:<>,.?/~|"
  
  possibilities = [new_msg]
  var arr = []
  for (let i = 0; i < new_msg.length; i += 8) arr.push(new_msg.substring(i, Math.min(i + 8, new_msg.length)))
  possibilities.push(arr.join(' '))
  
  for (var _ = 0; _ < 2; _++) {
    var rep1 = Math.floor(Math.random() * alphabet.length)
    var rep2 = Math.floor(Math.random() * alphabet.length)
    while (rep2 === rep1) rep2 = Math.floor(Math.random() * alphabet.length)
    possibilities.push(new_msg.replaceAll('0', alphabet[rep1]).replaceAll('1', alphabet[rep2]))
  }
  return possibilities
}
