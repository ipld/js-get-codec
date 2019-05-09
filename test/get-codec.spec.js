const getCodec = require('../')
const { it } = require('mocha')
const assert = require('assert')
const tsame = require('tsame')
const ci = require('@ipld/codec-interface')

const same = (...args) => assert.ok(tsame(...args))
const test = it

test('dag-json', async () => {
  let codec = await getCodec('dag-json')
  assert(codec.encode)
  assert(codec.decode)
  let buffer = await codec.encode({ hello: 'world' })
  let obj = await codec.decode(buffer)
  same(obj, { hello: 'world' })
})

test('dag-cbor', async () => {
  let codec = await getCodec('dag-cbor')
  assert(codec.encode)
  assert(codec.decode)
  let buffer = await codec.encode({ hello: 'world' })
  let obj = await codec.decode(buffer)
  same(obj, { hello: 'world' })
})

test('setCodec', async () => {
  let codec = await getCodec('dag-json')
  codec = ci.create(codec.encode, codec.decode, 'dag-nope')
  getCodec.setCodec(codec)
  codec = await getCodec('dag-nope')
  assert(codec.encode)
  assert(codec.decode)
  let buffer = await codec.encode({ hello: 'world' })
  let obj = await codec.decode(buffer)
  same(obj, { hello: 'world' })
})

test('raw', async () => {
  let codec = await getCodec('raw')
  let b = Buffer.from(Math.random().toString())
  same(codec.decode(b), b)
  same(codec.encode(b), b)
})

test('error', async () => {
  let str = Math.random().toString()
  try {
    await getCodec(str)
    assert.ok(false)
  } catch (e) {
    same(e.message, `Unknown codec ${str}`)
  }
})
