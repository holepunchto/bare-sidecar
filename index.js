const { spawn } = require('child_process')
const { Duplex } = require('stream')
const bare = require('./lib/bare')

module.exports = class Sidecar extends Duplex {
  constructor(entry, args = [], opts = {}) {
    if (!Array.isArray(args)) {
      opts = args
      args = []
    }

    super()

    this._process = spawn(bare, [entry, ...args], {
      stdio: ['pipe', 'pipe', 'pipe', 'overlapped']
    })

    this._process.on('close', this._onclose.bind(this)).on('exit', this._onexit.bind(this))

    const ipc = this._process.stdio[3]

    this._ipc = ipc.on('end', this._onend.bind(this))
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

  _read() {
    const data = this._ipc.read()

    if (data) this.push(data)
    else this._ipc.once('data', (data) => this.push(data))
  }

  _write(chunk, encoding, cb) {
    this._ipc.write(chunk, encoding, cb)
  }

  _predestroy() {
    this._process.kill()
  }

  _onend() {
    this._ipc.end()

    this.push(null)
  }

  _onclose() {
    this.end()
  }

  _onexit(code, status) {
    this.emit('exit', code, status)
  }
}
