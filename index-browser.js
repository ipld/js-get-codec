const ci = require('@ipld/codec-interface')
const cache = {}
const convert = (c, name) => ci.create(c.util.serialize, c.util.deserialize, name)

cache.raw = {
  encode: x => x,
  decode: x => x,
  codec: 'raw'
  // no reader, you can't read raw blocks
}

/* temp getFormat until the real one is implemented */
const getCodec = async codec => {
  if (cache[codec]) return cache[codec]
  let resolve = mod => {
    cache[codec] = mod.default
    return cache[codec]
  }
  let save = c => { 
    cache[codec] = c 
    return c
  }
  let _convert = m => save(convert(m.default))
  if (codec === 'dag-cbor') {
    cache[codec] = import('ipld-dag-cbor').then(_convert)
  }
  if (codec === 'dag-json') {
    cache[codec] = import('@ipld/dag-json').then(resolve)
  }
  if (cache[codec]) return cache[codec]
  else throw new Error(`Unknown codec ${codec}`)
}

module.exports = getCodec
module.exports.setCodec = codec => {
  cache[codec.codec] = codec
}

