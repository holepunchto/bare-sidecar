const test = require('brittle')
const Sidecar = require('bare-sidecar')

test('basic', (t) => {
  t.plan(1)

  const sidecar = new Sidecar(require.resolve('./test/fixtures/echo'))

  sidecar.on('data', (data) => t.is(data.toString(), 'Hello world')).write('Hello world')
})
