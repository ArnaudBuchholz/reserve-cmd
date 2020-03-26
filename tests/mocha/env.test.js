'use strict'

const assert = require('./assert')

describe('environment', () => {
  let mocked

  before(async () => {
    mocked = await require('./setup')
  })

  it('inject environment variable', () => mocked.request('GET', '/env_STATIC', {
    accept: 'text/plain'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString() === 'test\n')
    })
  )

  it('inject interpolated environment variable', () => mocked.request('GET', '/env_QUERY', {
    accept: 'text/plain'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString() === 'env_QUERY\n')
    })
  )
})
