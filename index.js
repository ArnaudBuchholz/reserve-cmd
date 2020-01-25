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
    response.write(`<html><head><title>${toHtml(redirect)}</title>`)
    response.write(mapping['html-header'] || '')
    response.write(`</head><body><pre>`)
  }
}

function writeHtml (mapping, response, chunk) {
  preHtml(mapping, '', response)
  response.write(toHtml(chunk.toString()))
  if (mapping['html-tracking']) {
    response.step = (response.step || 0) + 1
    response.write(`<a name="${response.step}" /><script>location.hash="${response.step}";</script>`)
  }
}

function writeText (mapping, response, chunk) {
  pre(response, TEXT_MIME_TYPE)
  response.write(chunk.toString())
}

function postHtml (mapping, response, end) {
  response.write('</pre>')
  response.write(mapping['html-footer'] || '')
  response.write('</body><html>')
  end()
}

const handlers = {}
handlers.GET = async ({ mapping, redirect, request, response }) => {
  let end
  const promise = new Promise(resolve => {
    end = () => {
      response.end()
      resolve()
    }
  })

  // FIRST implementation: If any mention of text/html, use it. Text otherwise
  const accept = request.headers.accept || ''
  let write
  let post
  if (accept.includes(HTML_MIME_TYPE) && !mapping['text-only']) {
    write = writeHtml
    post = postHtml
  } else {
    write = writeText
    post = end
  }

  const { file, args, options } = buildExecFileParameters(mapping, redirect)
  const cmd = childProcess.execFile(file, args, options)

  cmd.stdout.on('data', write.bind(null, mapping, response))
  cmd.stderr.on('data', write.bind(null, mapping, response))

  cmd.on('error', error => {
    const message = error.toString()
    response.writeHead(500, {
      'Content-Type': TEXT_MIME_TYPE,
      'Content-Length': message.length
    })
    response.write(message)
    end()
  })

  cmd.on('close', post.bind(null, mapping, response, end))
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
