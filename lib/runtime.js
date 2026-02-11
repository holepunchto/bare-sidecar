const Module = require('bare-module')
const Pipe = require('bare-pipe')
const os = require('bare-os')
const url = require('bare-url')
const path = require('bare-path')

const ipc = new Pipe(3)

Bare.IPC = ipc.unref()

const parentURL = url.pathToFileURL(os.cwd())

if (parentURL.pathname[parentURL.pathname.length - 1] !== '/') {
  parentURL.pathname += '/'
}

const entry = Module.resolve(path.resolve(Bare.argv[1]), parentURL)

Bare.argv[1] = url.fileURLToPath(entry)

Module.load(entry)
