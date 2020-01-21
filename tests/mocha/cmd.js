'use strict'

require('colors')

const param = process.argv.pop()
const handlers = {
  simple () {
    console.log('simple')
  },
  rainbow () {
    console.log('rainbow'.rainbow)
  }
}

handlers[param]()
