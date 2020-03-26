'use strict'

const childProcess = require('child_process')
const toHtml = require('./toHtml')
const parseCmd = require('./parseCmd')
const { interpolate } = require('reserve')

const HTML_MIME_TYPE = 'text/html'
const TEXT_MIME_TYPE = 'text/plain'

function buildExecFileParameters (mapping, match, redirect) {
  const parts = parseCmd(redirect)
  return {
    file: parts[0],
    args: parts.slice(1),
    options: {
      cwd: mapping.cwd,
      env: Object.assign({}, interpolate(match, mapping.env), process.env),
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

function preHtml (mapping, match, response) {
  if (pre(response, HTML_MIME_TYPE)) {
    response.write('<html><head>')
    response.write(interpolate(match, mapping['html-header']))
    if (mapping['html-tracking']) {
      response.write(`<script>
var _lastScrollPos
function scroll () {
  var pos = document.scrollingElement.scrollHeight
  if (pos !== _lastScrollPos) {
    _lastScrollPos = pos
    document.scrollingElement.scrollTop = pos
  }
}
</script>`)
    }
    response.write('</head><body><pre>')
  }
}

function writeHtml ({ mapping, match, response }, chunk) {
  preHtml(mapping, match, response)
  response.write(toHtml(chunk.toString()))
  if (mapping['html-tracking']) {
    response.write('<script>scroll()</script>')
  }
}

function writeText ({ response }, chunk) {
  pre(response, TEXT_MIME_TYPE)
  response.write(chunk.toString())
}

function postHtml ({ mapping, match, response }, end) {
  preHtml(mapping, match, response)
  response.write('</pre>')
  response.write(interpolate(match, mapping['html-footer']))
  response.write('</body></html>')
  end()
}

const handlers = {}
handlers.GET = async ({ mapping, match, redirect, request, response }) => {
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

  const { file, args, options } = buildExecFileParameters(mapping, match, redirect)
  const cmd = childProcess.execFile(file, args, options)

  const params = { mapping, match, response }

  cmd.stdout.on('data', write.bind(null, params))
  cmd.stderr.on('data', write.bind(null, params))

  cmd.on('error', error => {
    const message = error.toString()
    response.writeHead(500, {
      'Content-Type': TEXT_MIME_TYPE,
      'Content-Length': message.length
    })
    response.write(message)
    end()
  })

  cmd.on('close', post.bind(null, params, end))
  return promise
}

module.exports = {
  schema: {
    env: {
      type: 'object',
      defaultValue: {}
    },
    'html-footer': {
      type: 'string',
      defaultValue: ''
    },
    'html-header': {
      type: 'string',
      defaultValue: ''
    },
    'html-tracking': {
      type: 'boolean',
      defaultValue: false
    },
    'text-only': {
      type: 'boolean',
      defaultValue: false
    },
    timeout: {
      type: 'number',
      defaultValue: 0
    }
  },
  method: Object.keys(handlers),
  async redirect ({ mapping, match, redirect, request, response }) {
    return handlers[request.method]({ mapping, match, redirect, request, response })
  }
}
