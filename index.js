const { spawn } = require('child_process')
const { fileURLToPath } = require('url')
const { Duplex } = require('bare-stream')
const bare = require('./lib/bare')

module.exports = class Sidecar extends Duplex {
  constructor(entry, args = [], opts = {}) {
    if (!Array.isArray(args)) {
      opts = args
      args = []
    }

    super()

    if (typeof entry !== 'string') entry = fileURLToPath(entry)

    let { stdio = 'pipe' } = opts

    if (typeof stdio === 'string') stdio = [stdio, stdio, stdio]

    stdio = [0, 1, 2].map((i) => stdio[i] || 'pipe')

    this._exited = false

    this._process = spawn(bare, [entry, ...args], {
      detached: opts.detached,
      stdio: [...stdio, 'overlapped']
    })

    this._process.on('exit', this._onexit.bind(this)).on('close', this._onclose.bind(this))

    const ipc = this._process.stdio[3]

    this._ipc = ipc.on('end', this._onend.bind(this)).on('error', this._onerror.bind(this))
  }

  get stdin() {
    return this._process.stdin
  }

  get stdout() {
    return this._process.stdout
  }

  get stderr() {
    return this._process.stderr
  }

  kill(signal) {
    return this._process.kill(signal)
  }

  _read() {
    const data = this._ipc.read()

    if (data) this.push(data)
    else this._ipc.once('data', (data) => this.push(data))
  }

  _write(chunk, encoding, cb) {
    this._ipc.write(chunk, encoding, (err) => {
      // Writes to an IPC connection that is already destroyed fail too, which
      // either the process closing it or the error destroying it accounts for.
      cb(isClosedByProcess(err) || this._ipc.destroyed ? null : err)
    })
  }

  _destroy(err, cb) {
    if (this._exited) return cb(err)

    this._process.once('exit', () => cb(err)).kill()
  }

  _onexit(code, status) {
    this._exited = true

    this.emit('exit', code, status)
  }

  _onclose() {
    this.destroy()
  }

  _onend() {
    this._ipc.end()

    this.push(null)
  }

  _onerror(err) {
    if (isClosedByProcess(err)) return

    this.destroy(err)
  }
}

// A process that closes its end of the IPC connection, such as while exiting,
// fails writes with EPIPE or, on Linux with data still unread, resets the
// connection with ECONNRESET. Either way its exit already accounts for it.
function isClosedByProcess(err) {
  return err?.code === 'EPIPE' || err?.code === 'ECONNRESET'
}
