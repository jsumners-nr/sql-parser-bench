'use strict'

const assert = require('node:assert')
const parserA = require('./lib/parser-a/index.js')
const parserB = require('./lib/parser-b.js')
const tests = require('./lib/tests.json')

const iterations = 10_000
const formatter = new Intl.NumberFormat('en-US', {
  style: 'unit',
  unit: 'millisecond',
  maximumSignificantDigits: 4
})

const aStart = process.hrtime.bigint()
for (let i = 0; i < iterations; i += 1) {
  for (const {input, operation: expected} of tests) {
    const {operation: found} = parserA(input)
    assert.equal(found, expected)
  }
}
const aEnd = process.hrtime.bigint()
const aDuration = aEnd - aStart

const bStart = process.hrtime.bigint()
for (let i = 0; i < iterations; i += 1) {
  for (const {input, operation: expected} of tests) {
    const {operation: found} = parserB(input)
    assert.equal(found, expected)
  }
}
const bEnd = process.hrtime.bigint()
const bDuration = bEnd - bStart

console.log('original parser duration:', format(aDuration))
console.log('replacement parser duration:', format(bDuration))

if (aDuration < bDuration) {
  console.log('original is faster by:', format((bDuration - aDuration)))
} else {
  console.log('replacement is faster by:', format((aDuration - bDuration)))
}

function format(bigint) {
  return formatter.format(Number(bigint / 1_000_000n))
}
