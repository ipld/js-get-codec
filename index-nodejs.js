'use strict'
const ci = require('@ipld/codec-interface')
const util = require('multicodec/src/util')
const table = require('multicodec/src/name-table')

const basename = num => table[util.numberToBuffer(num).toString('hex')]

const raw = {
  encode: x => x,
  decode: x => x,
  codec: 'raw'
  // no reader, you can't read raw blocks
}

const implementations = [
  'ipld-dag-cbor',
  'ipld-dag-pb',
  'ipld-bitcoin',
  'ipld-zcash',
  'ipld-git']
  .map(str => require(str))
  .concat(Object.values(require('ipld-ethereum')))
  .map(c => ci.create(c.util.serialize, c.util.deserialize, basename(c.codec)))
  .concat([
    require('@ipld/dag-json'),
    raw
  ])
  .reduce((obj, codec) => {
    obj[codec.codec] = codec
    return obj
  }, {})

/* temp getFormat until the real one is implemented */
const getCodec = codec => {
  if (implementations[codec]) return implementations[codec]
  else throw new Error(`Unknown codec ${codec}`)
}

module.exports = getCodec
module.exports.setCodec = codec => {
  implementations[codec.codec] = codec
}
