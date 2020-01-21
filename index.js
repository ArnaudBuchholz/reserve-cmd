'use strict'

const childProcess = require("child_process")

const DEFAULT_MIME_TYPE = 'text/plain'

function buildExecParams (mapping, redirect) {
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

const handlers = {}
handlers.GET = async ({ mapping, redirect, request, response }) => {
  // text/plain, text/html, application/json
  const accept = /\w+\/\w+/.exec(request.headers.Accept)[0] || DEFAULT_MIME_TYPE
  const execParams = buildExecParams(mapping, redirect)
  const cmd = childProcess.exec(execParams.file, execParams.args, execParams.options)))


cmd
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
