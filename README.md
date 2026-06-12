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

#### `const sidecar = new Sidecar(entry[, args][, options])`

Spawn a bundled Bare runtime running `entry` and return a `Sidecar`. `entry` is the path to the module to run, typically resolved with `require.resolve()`. `args` is an array of additional command line arguments passed to the process. `options` is reserved for future use.

`Sidecar` extends a duplex stream. Writing to the stream sends data to the sidecar over its IPC channel, and data received from the sidecar over the same channel is emitted as `'data'` events. Destroying the stream kills the sidecar process.

The correct prebuilt Bare binary for the current platform and architecture is selected automatically and made executable on first use.

#### `sidecar.stdin`

The writable standard input stream of the underlying process.

#### `sidecar.stdout`

The readable standard output stream of the underlying process.

#### `sidecar.stderr`

The readable standard error stream of the underlying process.

#### `event: 'exit'`

Emitted when the sidecar process exits, with the arguments `code` and `status`. `code` is the exit code, or `null` if the process was terminated by a signal. `status` is the signal name that terminated the process, or `null` if it exited normally.

#### `event: 'close'`

Emitted after the sidecar process has exited and the stream has been destroyed.

## License

Apache-2.0
