'use strict'

const assert = require('node:assert')
const parserA = require('./lib/parser-a/index.js')
const parserB = require('./lib/parser-b.js')

const iterations = 10_000
const formatter = new Intl.NumberFormat('en-US', {
  style: 'unit',
  unit: 'millisecond',
  maximumSignificantDigits: 4
})

const sql = `
select
  foo,
  bar,
  baz
from some_db.some_table as a_table
where
    foo = 'foo'
`
const expected = 'select'

const aStart = process.hrtime.bigint()
for (let i = 0; i < iterations; i += 1) {
  const {operation: found} = parserA(sql)
  assert.equal(found, expected)
}
const aEnd = process.hrtime.bigint()
const aDuration = aEnd - aStart

const bStart = process.hrtime.bigint()
for (let i = 0; i < iterations; i += 1) {
  const {operation: found} = parserB(sql)
  assert.equal(found, expected)
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
