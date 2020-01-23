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

const param = process.argv.pop()
const handlers = {
  simple () {
    console.log('simple')
  },
  rainbow () {
    console.log('rainbow'.rainbow)
  },
  rainbow_c () {
    console.log(c('rainbow'.rainbow))
  },
  red () {
    console.log('red'.red)
  },
  red_c () {
    console.log(c('red'.red))
  }
}

handlers[param]()
