# bare-sidecar

Start and manage Bare sidecar processes from Node.js and Electron. A sidecar is a separate Bare process spawned from a host runtime, with a dedicated IPC channel exposed as a duplex stream on both ends.

```
npm i bare-sidecar
```

## Usage

In the host process:

```js
const Sidecar = require('bare-sidecar')

const sidecar = new Sidecar(require.resolve('./entry'))

sidecar
  .on('exit', (code, status) => {
    // The sidecar process exited
  })
  .on('data', (data) => {
    // Received data from the sidecar over IPC
  })
  .write('Hello sidecar')
```

In the sidecar entry (`entry.js`), the IPC channel is available as a stream on `Bare.IPC`:

```js
Bare.IPC.on('data', (data) => Bare.IPC.write(data))
```

## API

See the [`bare-sidecar` reference](https://docs.pears.com/reference/bare/modules/bare-sidecar).

## License

Apache-2.0
