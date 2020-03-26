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
      assert(() => response.toString().includes('<pre>simple\n</pre>'))
    })
  )

  it('returns html content (formatted)', () => mocked.request('GET', '/rainbow', {
    accept: 'text/html'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString().includes('<span class="red">r</span>'))
    })
  )

  it('supports html tracking', () => mocked.request('GET', '/customized/rainbow', {
    accept: 'text/html'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString().includes('<script>scroll()</script>'))
    })
  )

  it('supports header / footer insertion', () => mocked.request('GET', '/customized/rainbow', {
    accept: 'text/html'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString().includes('<script src="header.js"></script>'))
      assert(() => response.toString().includes('<p>footer'))
    })
  )

  it('supports header / footer interpolation', () => mocked.request('GET', '/customized/rainbow', {
    accept: 'text/html'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString().includes('<title>rainbow</title>'))
      assert(() => response.toString().includes('footer: rainbow'))
    })
  )

  it('supports asynchronous chunks', () => mocked.request('GET', '/countdown', {
    accept: 'text/html'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString().includes('10\n9\n8\n7\n6\n5\n4\n3\n2\n1\n'))
    })
  )

  it('supports empty result', () => mocked.request('GET', '/empty', {
    accept: 'text/html'
  })
    .then(response => {
      assert(() => response.statusCode === 200)
      assert(() => response.toString().includes('<html><head>'))
      assert(() => response.toString().includes('</head><body>'))
      assert(() => response.toString().includes('</body></html>'))
    })
  )
})
