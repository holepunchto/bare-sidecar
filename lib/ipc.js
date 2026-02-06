const { Duplex } = require('bare-stream')

const ipc = global[Symbol.for('bare.sidecar.ipc')] || null

class SidecarIPC extends Duplex {
  _read() {
    const data = ipc.read()

    if (data) this.push(data)
    else ipc.once('data', (data) => this.push(data))
  }

  _write(chunk, encoding, cb) {
    ipc.write(chunk, encoding, cb)
  }
}

module.exports = ipc ? new SidecarIPC() : null
