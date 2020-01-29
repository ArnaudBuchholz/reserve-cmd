'use strict'

module.exports = require('reserve/mock')({
  port: 8000,
  handlers: {
    cmd: require('../../index.js')
  },
  mappings: [{
    match: /\/(.*)/,
    cwd: __dirname,
    cmd: 'node ../cmd.js `$1`'
  }]
})
