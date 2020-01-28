'use strict'

module.exports = redirect => {
  const result = []
  const add = text => result.push(text.replace(/``/g, '`'))
  redirect.replace(/`((?:[^`]|``)+)`|([^ ](?:[^ ]|``)*)/g, (match, escaped, raw) => {
    add(escaped || raw)
  })
  return result
}
