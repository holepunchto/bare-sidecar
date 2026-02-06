const IPC = require('bare-sidecar/ipc')

IPC.on('data', (data) => IPC.write(data))
