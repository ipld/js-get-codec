'use strict'
const ci = require('@ipld/codec-interface')
const util = require('multicodec/src/util')
const table = require('multicodec/src/name-table')

const basename = num => table[util.numberToBuffer(num).toString('hex')]

if (!window.codecCache) {
  window.codecCache = {}
}

const cache = window.codecCache

const _convert = c => ci.create(c.util.serialize, c.util.deserialize, basename(c.codec))

cache['dag-json'] = require('@ipld/dag-json')
cache['dag-cbor'] = _convert(require('ipld-dag-cbor'))
cache['dag-pb'] = _convert(require('ipld-dag-pb'))
cache.raw = {
  encode: x => x,
  decode: x => x,
  codec: 'raw'
}

const getCodec = codec => {
  if (cache[codec]) return cache[codec]
  throw new Error(`Unknown codec ${codec}`)
}

module.exports = getCodec

module.exports.setCodec = codec => {
  if (codec.util) codec = _convert(codec)
  cache[codec.codec] = codec
}
