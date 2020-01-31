'use strict'

module.exports = require('reserve/mock')({
  port: 8000,
  handlers: {
    cmd: require('../../index.js')
  },
  mappings: [{
    match: /\/error/,
    cmd: 'hopefully-not-a-process'
  }, {
    match: /\/customized\/(.*)/,
    cwd: __dirname,
    'html-tracking': true,
    'html-header': '<script src="header.js"></script>',
    'html-footer': '<p>footer</p>',
    cmd: 'node ../cmd.js `$1`'
  }, {
    match: /\/(.*)/,
    cwd: __dirname,
    cmd: 'node ../cmd.js `$1`'
  }]
})
