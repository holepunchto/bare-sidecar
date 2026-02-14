const test = require('brittle')
const Sidecar = require('bare-sidecar')

const isWindows = Bare.platform === 'win32'

test('basic', (t) => {
  t.plan(3)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/echo'))

  sidecar
    .on('exit', () => t.pass('exited'))
    .on('close', () => t.pass('closed'))
    .on('data', (data) => {
      t.is(data.toString(), 'Hello world')
      sidecar.destroy()
    })
    .write('Hello world')
})

test('kill on destroy', (t) => {
  t.plan(3)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/sleep'))

  sidecar
    .on('exit', (code, status) => {
      t.is(code, isWindows ? 1 : 0)
      t.is(status, 15)
    })
    .on('close', () => t.pass('closed'))
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
    .on('close', () => t.pass('closed'))
})

test('exit on ipc destroy', (t) => {
  t.plan(3)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/ipc-destroy'))

  sidecar
    .on('exit', (code, status) => {
      t.is(code, 0)
      t.is(status, 0)
    })
    .on('close', () => t.pass('closed'))
})

test('uncaught throw', { skip: isWindows }, (t) => {
  t.plan(3)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/throw'))

  sidecar
    .on('exit', (code, status) => {
      t.is(code, isWindows ? 3 : 0)
      t.is(status, isWindows ? 0 : 6)
    })
    .on('close', () => t.pass('closed'))
})
