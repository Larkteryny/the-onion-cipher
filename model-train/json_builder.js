const fs = require('fs')

fs.readFile('text.txt', (err, data) => {
  if (err) throw err
  contents = data.toString()
  contents = contents.split('\n')
  contents = JSON.stringify(contents)
  contents = contents.replaceAll('","', '",\n"')
  //console.log(contents)
  fs.writeFile('text.json', contents, (err) => { console.log(err) })
})
