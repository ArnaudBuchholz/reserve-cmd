'use strict'

const assert = require('./assert')

describe('text', function () {
  this.timeout(5000) // Since a real process is triggered
  let mocked

  before(async () => {
    mocked = await require('./setup')
  })

  it('returns text content', () => mocked.request('GET', '/simple', {
    accept: 'text/plain'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString() === 'simple\n')
    })
  )

  it('returns text content (formatted)', () => mocked.request('GET', '/rainbow', {
    accept: 'text/plain'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString().includes('\x1B'))
    })
  )

  it('supports asynchronous chunks', () => mocked.request('GET', '/countdown', {
    accept: 'text/plain'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString() === '10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n')
    })
  )
})
