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
const string = strings[sample]
const showCode = process.argv.pop() === '-c'

if (showCode) {
  console.log(c(string))
} else {
  console.log(string)
}
