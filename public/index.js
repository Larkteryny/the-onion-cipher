// all variables
var draggables = document.querySelectorAll('.draggable')
var containers = document.querySelectorAll('.container')
// Globally accessible
const key_req = ["Caesar", "Vigenere", "Blowfish"]

function addDraggables() {
  // Adding event listeners to each draggable
  draggables.forEach(draggable => {
    draggable.addEventListener('dragstart', () => {
      draggable.classList.add('dragging')
    })

    draggable.addEventListener('dragend', () => {
      draggable.classList.remove('dragging')
    })
  })

  //Adding event listener to each container to move the draggable
  containers.forEach(container => {
    container.addEventListener('dragover', e => {
      e.preventDefault()
      const afterElement = getDragAfterElement(container, e.clientY)
      const draggable = document.querySelector('.dragging')
      if (afterElement == null) {
        container.appendChild(draggable)
      } else {
        container.insertBefore(draggable, afterElement)
      }
    })
  })
}

// function that determines the position of the dragged element relative to the other draggables
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect()
    const offset = y - box.top - box.height / 2
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child }
    } else {
      return closest
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element
}

export async function removeAll() {
  console.log("remove all")
  var container = document.getElementById("useEncryption")
  container.innerHTML = `    <p>Encryption to be used</p>
    
    <button type="submit" onclick='addContainer("Caesar")'>Caesar</button>
    <button type="submit" onclick='addContainer("Vigenere")'>Vigenere </button>
    <button type="submit" onclick='addContainer("Blowfish")'>Blowfish </button>
    <button type="submit" onclick='addContainer("SHA256")'>SHA256 </button>
    <button type="submit" onclick='addContainer("SHA1")'>SHA1 </button>
    <button type="submit" onclick='addContainer("MD5")'>MD5 </button>
    <button type="submit" onclick='addContainer("Base64")'>Base64 </button>
    <button type="submit" onclick='addContainer("Leet")'>Leet </button>
    <button type="submit" onclick='addContainer("Morse")'>Morse </button>
    <button type="submit" onclick='addContainer("Binary")'>Binary </button>
    <br><br>
    <button type="submit" onclick='removeAll()'>Clear All</button>`
}

export async function addContainer(name) {
  // Variables
  var container = document.getElementById("useEncryption")
  var usedKeys = container.querySelectorAll(".Key")
  // var usedKeys = container.getElementsByClassName("Key")

  console.log(usedKeys)
  // console.log("stuff")
  // console.log(container)
  // for (let i = 0; i < usedKeys.length; i++) {
  //   console.log("inside")

  //   console.log(usedKeys[i].value)
  // }
  // console.log("stuff2")

  const keys = []
  for (let i = 0; i < usedKeys.length; i++) {
    if (typeof usedKeys[i].value === 'undefined') {

    } else {
      keys.push(usedKeys[i].value)
    }
  }

  var html = String(container.innerHTML)
  // var index = html.indexOf(`value="`)
  // var copyhtml = String(container.innerHTML)
  var indexList = []
  // var textLength = 0;

  for (var i = 0; i < html.length - 7; i++) {
    if (html.substring(i, i + 7) === `value="`) {
      indexList.push(i)
    }
  }

  console.log("---")

  var count = indexList.length - 1
  var length = html.length - 7
  for (var i = length; i >= 0; i--) {
    if (html.substring(i, i + 7) === `value="`) {
      console.log(html.substring(0, i + 7))
      console.log(keys[count])
      console.log((html.substring(i + 7)))
      console.log(html.substring(html.substring(i + 7).indexOf("\"") + i + 7))
      html = html.substring(0, i + 7) + keys[count] + html.substring(html.substring(i + 7).indexOf("\"") + i + 7)
      // console.log(indexList[count] + html.substring(html.substring(i).indexOf(`"`), i))


      // html = html.substring(0,i) + indexList[count] + html.substring(i)
      count--
    }
  }

  console.log("---2")
  console.log(keys)
  // console.log(indexList)
  // console.log(html)
  console.log("e")

  var text = ''
  text += `<p3 id = "${name}" class="draggable" draggable="true">` + name

  if (key_req.includes(name)) {
    text += ` <input type="text" class = "Key" placeholder="Key required" value=""></p3> `
  } else {
    text += `<div100 class = "Key"> </div100> </p3>`
  }
  html += text
  // container.innerHTML += text
  console.log(container.innerHTML)
  console.log(keys)
  console.log(text)

  // var html = String(container.innerHTML)
  // var count = 0
  // // console.log(html)
  // // console.log("88888888")
  // // console.log(html.indexOf("any potential keys?"))
  // // console.log("9999999999")
  // var index = html.indexOf("any potential keys?")

  // // console.log(html.substring(0, index + 20) + `value="` + "[eee]" + `"` + html.substring(index + 20))
  // // console.log("00000000000")
  // // console.log(html.substring(index + 21))
  // // html = html.substring(0, index + 21) + html.substring(index + 21)

  // while (html.includes("any potential keys?")) {
  //   html = html.substring(0, index + 20) + `value="` + keys[count] + `"` + html.substring(index + 20)

  //   count++
  //   if (count == 1000) {
  //     break
  //   }
  // }
  container.innerHTML = html
  draggables = document.querySelectorAll('.draggable')
  containers = document.querySelectorAll('.container')
  addDraggables()




  // if (name === "Caesar") {
  //   container.innerHTML += `<p3 id = "Caesar" class="draggable" draggable="true">Caesar <input type="text" id="Key" placeholder="any potential keys?"></p3> `
  // } else if ("Vigenere") {
  // container.innerHTML += `<p3 id = "Caesar" class="draggable" draggable="true">Caesar <input type="text" id="Key" placeholder="any potential keys?"></p3> `
  // } 
}

export async function encrypt() {
  console.log("encrypting")
  // Get plaintext
  var msg = document.getElementsByName("to_encrypt")[0].value
  // Get sequence
  var container = document.getElementById("useEncryption")
  var usedEncryption = container.querySelectorAll(".draggable")
  var usedKeys = container.querySelectorAll(".Key")
  console.log(container)
  console.log(usedEncryption)
  // console.log("---")

  const seq = [] // TODO

  for (let i = 0; i < usedEncryption.length; i++) {
    seq.push(String(usedEncryption[i].id))
    // console.log(usedEncryption[i])
  }
  console.log("---")

  // Get keys
  /*
  Perform checks:
  -Caesar cipher key is valid number
  -Vigenere key contains only letters
  */
  const keys = [] // TODO
  for (let i = 0; i < usedKeys.length; i++) {
    // usedEncryption[i].getElementsByTagName
    // console.log(usedKeys[i].value)
    if (typeof usedKeys[i].value === 'undefined') {
      keys.push(" ")
    } else {
      keys.push(usedKeys[i].value)
    }
    // keys.push(usedKeys[i].value)
    // console.log(usedEncryption[i].getElementsByClassName("Key"))
    // keys.push(String(usedEncryption[i].id))
  }

  // Send POST request to get ciphertext
  const post_body = { "to_encrypt": msg, "seq": seq, "keys": keys }
  var res = await fetch('https://theonioncipher.ethan11111.repl.co/encrypt', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post_body)
  })
    .then(data => {
      return data.json()
    })
    .then(data => {
      console.log(data)
      msg = data
      console.log(msg)
      console.log('finished')
      // Display
      var output = document.getElementById("encodingID")
      console.log(output)
      output.value = msg
    })
    .catch(error => console.log("Error:", error))

  return msg
}



export async function decrypt() {
  console.log('decrypting')
  // Get ciphertext
  var msg = document.getElementsByName("to_decrypt")[0].value

  // Get user-provided keys
  var keys_field = document.getElementsByName("poss_keys")[0].value
  var keys = []
  var key = ""
  var i = 0
  while (i < keys_field.length) {
    if (keys_field[i] === ';') {
      keys.push(key)
      key = ""
      i++
      continue
    } else if (keys_field[i] === '\\') {
      keys_field = keys_field.substring(0, i) + keys_field.substring(i + 1)
    }
    key += keys_field[i]
    i++
  }
  keys.push(key)

  // Send POST request to get possible plaintext
  const post_body = { "to_decrypt": msg, "keys": keys }
  const possibilities = await fetch('https://theonioncipher.ethan11111.repl.co/decrypt', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(post_body)
  })
    .then(data => {
      return data.json()
    })
    .then(data => {
      return data.possibilities
    })
    .catch(error => console.log("Error:", error))

  var output = document.getElementById("decryptionResults")
  var outputData = ""

  for (const poss of possibilities) { // Loops through message possibilities
    /*
    <div style="display: table-row">
        <div style="width: 300px; display: table-cell;">
          <h1>57</h1>
          <p>
            SHA256
          </p>
          <p4>
            Steps:<br>
            Caesar<br>
            &emsp;&emsp;Key: 25
          </p4>
        </div>
        <div style="display: table-cell;"><p>Message</p></div>
    </div>
  </div>
  <hr></hr>
    */
    outputData += '<div style="display: table-row"><div style="width: 250px; display: table-cell;">'
    outputData += `<h1>${Math.round(poss.confidence * 100)}% Confidence</h1>`
    outputData += `<h2>${poss.algo}</h2>`
    outputData += "<p4>Steps:<br>"
    
    for (const step of poss.steps) {
      outputData += "-" + step.algo + "<br>"

      const attrs = Object.keys(step)
      for (const attr of attrs) {
        if (attr === "algo") continue
        outputData += `&emsp;&emsp;${attr}: ${step[attr]}<br>`
      }
    }

    outputData += "</p4></div>"
    outputData += `<div style="display: table-cell; width: 1500px;"><p>${poss.text}</p></div>`
    outputData += "<hr></hr></div>"
  }
  // Send to HTML
  output.innerHTML = outputData
}
