'use strict'

const logger = require('pino')({
  level: 'debug'
})

logger.traceEnabled = () => false

module.exports = logger
