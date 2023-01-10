/*
Text sources:
https://en.wikipedia.org/wiki/Cyber-security_regulation

*/

const fs = require('fs')

fs.readFile('text.txt', (err, data) => {
  if (err) throw err
  str = data.toString()
  str = str.replace(/\[[^\]]{1,5}\]/g, '')
  str = str.replace(/\.\s/g, '.\n')
  str = str.replace(/\."\s/g, '."\n')
  str = str.replace(/\n+/g, '\n')
  str = str.replace(/\n\s+/g, '\n')
  console.log(str)
  fs.writeFile('./texttemp.txt', str, (err) => { console.log(err) })
})

