'use strict'

const assert = require('./assert')

describe('html', function () {
  this.timeout(5000) // Since a real process is triggered
  let mocked

  before(async () => {
    mocked = await require('./setup')
  })

  it('returns html content', () => mocked.request('GET', '/simple', {
    accept: 'text/html'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      // assert(() => response.toString() === 'simple\n')
    })
  )

  it('returns html content (formatted)', () => mocked.request('GET', '/rainbow', {
    accept: 'text/html'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      console.log(response.toString())
      assert(() => response.toString().includes('class="red"'))
    })
  )
})
