'use strict'

const childProcess = require('child_process')
const toHtml = require('./toHtml')

const HTML_MIME_TYPE = 'text/html'
const TEXT_MIME_TYPE = 'text/plain'

function buildExecFileParameters (mapping, redirect) {
  const parts = []
  redirect.replace(/`([^`]*)`|([^ ]+)/g, (match, raw, escaped) => {
    parts.push(raw || escaped)
  })
  return {
    file: parts[0],
    args: parts.slice(1),
    options: {
      cwd: mapping.cwd,
      env: Object.assign({}, mapping.env || {}, process.env),
      timeout: mapping.timeout | 0
    }
  }
}

function pre (response, contentType) {
  if (!response.headersSent) {
    response.writeHead(200, {
      'Content-Type': contentType
    })
    response.flushHeaders()
    return true
  }
}

function preHtml (mapping, redirect, response) {
  if (pre(response, HTML_MIME_TYPE)) {
    response.write(`<html>
  <head>
    <title>${toHtml(redirect)}</title>
    <link rel="stylesheet" type="text/css" href="/res/console.css">
  </head>
  <body>
    <pre>`)
}

function writeHtml (mapping, response, text) {
  response.write(toHmtml(text.toString()))
  if (mapping['html-tracking']) {
    response.write(`<a name="${++step}" /><script>location.hash="${step}";</script>`)
  }
}

function writeText (mapping, response, text) {
  response.write(text)
}

function postHtml (resolver, mapping, response) {
  response.write(`
    </pre>
  </body>
<html>`)
  resolver()
}

const handlers = {}
handlers.GET = async ({ mapping, redirect, request, response }) => {
  let resolver
  const promise = new Promise(resolve => {
    resolver = resolve
  })

  // FIRST implementation: If any mention of text/html, use it. Text otherwise
  const accept = request.headers.Accept || ''
  let pre
  let write
  let post
  if (accept.includes(HTML_MIME_TYPE)) {
    pre = preHtml
    write = writeHtml
    post = postHtml.bind(null, resolver)
  } else {
    pre = pre
    write = writeText
    post = resolver
  }

  const { file, args, options } = buildExecFileParameters(mapping, redirect)
  const cmd = childProcess.execFile(file, args, options)

  cmd.stdout.on('data', write.bind(null, mapping, response))
  cmd.stderr.on('data', write.bind(null, mapping, response))

  cmd.on('error', () => {
    const message = err.toString()
    response.writeHead(500, {
      'Content-Type': TEXT_MIME_TYPE,
      'Content-Length': message.length
    })
    response.end(message)
    resolver()
  })

  cmd.on('close', post.bind(null, mapping, response, resolver))
  return promise
}

module.exports = {
  async redirect ({ mapping, match, redirect, request, response }) {
    const handler = handlers[request.method]
    if (handler) {
      return handler({ mapping, match, redirect, request, response })
    }
    return 500
  }
}
