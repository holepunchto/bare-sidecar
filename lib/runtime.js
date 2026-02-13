const Module = require('bare-module')
const Pipe = require('bare-pipe')
const os = require('bare-os')
const url = require('bare-url')
const path = require('bare-path')

const ipc = new Pipe(3)

ipc.on('newListener', onnewlistener).on('removeListener', onremovelistener).on('close', onclose)

function onnewlistener(name, fn) {
  if (fn === onremovelistener || fn === onclose) return

  switch (name) {
    case 'close':
      ipc.off(name, onclose)
  }
}

function onremovelistener(name, fn) {
  if (fn === onremovelistener || fn === onclose) return

  switch (name) {
    case 'close':
      if (ipc.listenerCount(name) === 0) ipc.on(name, onclose)
  }
}

function onclose() {
  Bare.exit()
}

Bare.IPC = ipc.unref()

const parentURL = url.pathToFileURL(os.cwd())

if (parentURL.pathname[parentURL.pathname.length - 1] !== '/') {
  parentURL.pathname += '/'
}

const entry = Module.resolve(path.resolve(Bare.argv[1]), parentURL)

Bare.argv[1] = url.fileURLToPath(entry)

Module.load(entry)
