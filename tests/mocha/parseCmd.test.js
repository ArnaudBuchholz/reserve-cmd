'use strict'

require('colors')
const assert = require('./assert')
const parseCmd = require('../../parseCmd')

function test (redirect, expected) {
  return () => {
    const cmd = parseCmd(redirect)
    assert(() => cmd.length === expected.length)
    cmd.forEach((part, index) => {
      assert(() => part === expected[index])
    })
  }
}

describe('parseCmd', () => {
  it('splits on spaces by defaut', test('Hello World', ['Hello', 'World']))

  it('ignores multiple spaces separator', test('Hello    World', ['Hello', 'World']))

  it('ignores trimming spaces', test(' Hello World ', ['Hello', 'World']))

  describe('escaping with ` (reverse quote)', () => {
    it('allows escaping', test('`Hello World`', ['Hello World']))

    it('keeps spaces within escaping', test('Hello `  World  `', ['Hello', '  World  ']))

    describe('escaping the escape', () => {
      it('handles boundaries', test('Hello ``World``', ['Hello', '`World`']))

      it('handles inner content', test('Hello Wor``ld', ['Hello', 'Wor`ld']))

      it('handles in escaped string', test('Hello ` Wor``ld `', ['Hello', ' Wor`ld ']))

      it('handles boundaries in escaped string', test('Hello ```Wor  ld ```', ['Hello', '`Wor  ld `']))
    })
  })
})
