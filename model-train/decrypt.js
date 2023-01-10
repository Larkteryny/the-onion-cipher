module.exports.decrypt = decrypt

const bf = require('javascript-blowfish')

// "Dictionary" of functions to call for each algorithm
const algos = {
  "Caesar": caesar,
  "Vigenere": vigenere,
  "Blowfish": blowfish,
  "Base64": b64,
  "Leet": leet,
}

// Main encryption function
function decrypt(algo, msg, key) {
  return algos[algo](msg, key)
}

function caesar(msg, keys) {
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
    // Find set with longest length 
    var max_k = 0
    for (const a of alphaset) {
      if (a.length > max_k) max_k = a.length
    }

    k = Math.floor(Math.random() * max_k)
    var new_msg = ""
    for (const c of msg) new_msg += cipher(c, k, alphaset)
    possibilities.push(new_msg)
  }
  
  return possibilities
}

function vigenere(msg, keys) {
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
      result = cipher(c, k[k_i])
      new_msg += result[0]
      k_i += result[1]
    }
    possibilities.push(new_msg)
  }

  return possibilities
}

function blowfish(msg, keys) {
  var msgs = [msg]
  
  possibilities = []
  for (const key of keys) {
    var blowfish = new bf.Blowfish(key)
    for (msg of msgs) {
      var new_msg = blowfish.decryptECB(blowfish.base64Decode(msg))
      possibilities.push(new_msg)
    }
  }
  return possibilities
}

function b64(msg, keys) {
  // Conforms msg length to multiple of 4 for atob function
  msg = msg.trim().replace(/=+$/, '')
  if (msg.length % 4) msg += '='.repeat(4 - msg.length % 4)
  
  return [atob(msg)]
}

function leet(msg, keys) {
  // Will replace almost all punctuation and numbers, result will be all lowercase
  // Extremely destructive, likely to stump analysis
  const swap = [['\\_:_/', 'w'], ['\\_|_/', 'w'], ['/\\/\\', 'm'], ['|\\/|', 'm'], ['(_,)', 'q'], ['\\/\\/', 'w'], ['/-\\', 'a'], ['|-\\', 'a'], ['(_+', 'g'], ['(-)', 'h'], [')-(', 'h'], ['/-/', 'h'], [':-:', 'h'], ['[-]', 'h'], [']-[', 'h'], [']~[', 'h'], ['|-|', 'h'], ['|~|', 'h'], ['/V\\', 'm'], ['|V|', 'm'], ['/\\/', 'n'], ['[\\]', 'n'], ['|\\|', 'n'], ['()_', 'q'], ['(_)', 'u'], ['|_|', 'u'], ['\\V/', 'w'], ['\\X/', 'w'], ['\\^/', 'w'], ['\\|/', 'w'], ['/\\', 'a'], ['[)', 'd'], ['|)', 'd'], ['|>', 'd'], ['|]', 'd'], ['[-', 'e'], ['/=', 'f'], ['|=', 'f'], ['}{', 'h'], ['_/', 'j'], ['_|', 'j'], ['|<', 'k'], ['|{', 'k'], ['1_', 'l'], ['[_', 'l'], ['|_', 'l'], ['()', 'o'], ['[]', 'o'], ['/*', 'p'], ['|*', 'p'], ['|o', 'p'], ['<|', 'q'], ['/2', 'r'], ['|2', 'r'], ['|?', 'r'], ['\\/', 'v'], ['|/', 'v'], ['vv', 'w'], [')(', 'x'], ['><', 'x'], ['`/', 'y'], ['>_', 'z'], ['4', 'a'], ['@', 'a'], ['8', 'b'], ['(', 'c'], ['<', 'c'], ['[', 'c'], ['3', 'e'], ['6', 'g'], ['#', 'h'], ['!', 'i'], [':', 'i'], [']', 'i'], [';', 'j'], ['1', 'l'], ['|', 'l'], ['0', 'o'], ['2', 'r'], ['$', 's'], ['5', 's'], ['7', 't'], ['A', 'a'], ['B', 'b'], ['C', 'c'], ['D', 'd'], ['E', 'e'], ['F', 'f'], ['G', 'g'], ['H', 'h'], ['I', 'i'], ['J', 'j'], ['K', 'k'], ['L', 'l'], ['M', 'm'], ['N', 'n'], ['O', 'o'], ['P', 'p'], ['Q', 'q'], ['R', 'r'], ['S', 's'], ['T', 't'], ['U', 'u'], ['V', 'v'], ['W', 'w'], ['X', 'x'], ['Y', 'y'], ['Z', 'z']]
  for (const code of swap) {
    msg = msg.replaceAll(code[0], code[1])
  }
  return [msg]
}