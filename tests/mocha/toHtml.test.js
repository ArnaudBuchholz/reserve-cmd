'use strict'

const assert = require('./assert')
const toHtml = require('../../toHtml')

describe('toHtml', () => {

  it('returns original string when no transformation is required', () => {
    assert(() => toHtml('Hello World!') === 'Hello World!')
  })

  it('escapes basic HTML entities', () => {
    assert(() => toHtml('<< safe & reliable >>') === '&lt;&lt; safe &amp; reliable &gt;&gt;')
  })

})
