const test = require('brittle')
const Sidecar = require('bare-sidecar')

test('basic', (t) => {
  t.plan(1)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/echo'))

  sidecar.on('data', (data) => t.is(data.toString(), 'Hello world')).write('Hello world')
})

test('kill on destroy', (t) => {
  t.plan(3)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/sleep'))

  sidecar
    .on('exit', (code, status) => {
      t.is(code, 0)
      t.not(status, 0)
    })
    .on('close', () => {
      t.pass('closed')
    })
    .destroy()
})

test('exit on ipc close', (t) => {
  t.plan(3)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/ipc-close'))

  sidecar
    .on('exit', (code, status) => {
      t.is(code, 0)
      t.is(status, 0)
    })
    .on('close', () => {
      t.pass('closed')
    })
})

test('exit on ipc destroy', (t) => {
  t.plan(3)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/ipc-destroy'))

  sidecar
    .on('exit', (code, status) => {
      t.is(code, 0)
      t.is(status, 0)
    })
    .on('close', () => {
      t.pass('closed')
    })
})

test('uncaught throw', (t) => {
  t.plan(3)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/throw'))

  sidecar
    .on('exit', (code, status) => {
      t.is(code, 0)
      t.not(status, 0)
    })
    .on('close', () => {
      t.pass('closed')
    })
})
