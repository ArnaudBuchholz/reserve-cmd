'use strict'

require('colors')
const assert = require('./assert')
const toHtml = require('../../toHtml')

describe('toHtml', () => {

  it('returns original string when no transformation is required', () => {
    assert(() => toHtml('Hello World!') === 'Hello World!')
  })

  it('escapes basic HTML entities', () => {
    assert(() => toHtml('<< safe & reliable >>') === '&lt;&lt; safe &amp; reliable &gt;&gt;')
  })

  it('converts color escape to HTML', () => {
    assert(() => toHtml('red'.red) === '<span class="red">red</span>')
  })

  it('converts colors escapes to HTML', () => {
    assert(() => toHtml('red'.rainbow) === [
      '<span class="red">r</span>',
      '<span class="yellow">e</span>',
      '<span class="green">d</span>'
    ].join(''))
  })

  it('converts bold escape to HTML', () => {
    assert(() => toHtml('bold'.bold) === '<b>bold</b>')
  })

  it('converts underline escape to HTML', () => {
    assert(() => toHtml('___'.underline) === '<u>___</u>')
  })

  it('converts italic escape to HTML', () => {
    assert(() => toHtml('abc'.italic) === '<i>abc</i>')
  })
})
