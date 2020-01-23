'use strict'

const colors = {
  1: '<b>',
  22: '</b>',
  4: '<u>',
  24: '</u>',
  39: '</span>',
  0: '</span>'
}

const span = className => `<span class="${className}">`

'black,red,green,yellow,blue,magenta,cyan,white'
  .split(',')
  .forEach((color, index) => {
    colors[`3${index}`] = span(color)
    colors[`3${index};1`] = span(color)
    colors[`9${index}`] = span(`${color} bright`)
  })

module.exports = string => {
  const html = string
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/█/g, '&marker;')
  if (html.includes('\x1B[')) {
    return html.replace(/\x1B\[([0-9;]+)m/g, (_, code) => colors[code] || '')
  }
  return html
}
