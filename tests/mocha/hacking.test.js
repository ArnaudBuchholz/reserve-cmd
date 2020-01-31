'use strict'

const assert = require('./assert')

describe('hacking', () => {
  let mocked

  before(async () => {
    mocked = await require('./setup')
  })

  'HEAD,POST,PUT,DELETE,CUSTOM'.split(',').forEach(verb => {
    it(`prevents unauthorized verb use (${verb})`, () => mocked.request(verb, '/simple')
      .then(response => {
        assert(() => response.statusCode === 500)
      })
    )
  })

  it('handles error', () => mocked.request('GET', '/error')
    .then(response => {
      assert(() => response.statusCode === 500)
    })
  )
})
