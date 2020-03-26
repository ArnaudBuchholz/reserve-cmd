'use strict'

require('colors')

function c (string) {
  return string.split('')
    .map(char => {
      if (char === '\x1B') {
        return '\\x1B'
      }
      return char
    })
    .join('')
}

const strings = {
  simple: 'simple',
  rainbow: 'rainbow'.rainbow,
  red: 'red'.red,
  underline: 'underline'.underline,
  italic: 'italic'.italic,
  mix: ('red ' + 'blue'.blue).red.italic
}

const sample = process.argv.pop()
let string
if (sample.startsWith('env_')) {
  string = process.env[sample.substring(4)]
} else {
  string = strings[sample]
}
const showCode = process.argv.pop() === '-c'

let count = 10
function counter () {
  console.log(count.toString())
  if (--count) {
    setTimeout(counter, 100)
  }
}

if (sample === 'countdown') {
  counter()
} else if (showCode) {
  console.log(c(string))
} else if (string) {
  console.log(string)
}
