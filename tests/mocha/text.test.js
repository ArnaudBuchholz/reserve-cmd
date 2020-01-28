'use strict'

const assert = require('./assert')

describe('client', async () => {
  let mocked

  before(async () => {
    mocked = await require('./setup')
  })

  it('returns text content', () => mocked.request('GET', '/cmd?param=simple', {
    accept: 'text/plain'
  })
    .then(response => {
      assert(() => response.toString() === 'simple')
    })
  )
})
