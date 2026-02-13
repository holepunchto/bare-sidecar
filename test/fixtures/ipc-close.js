Bare.IPC.end()

setTimeout(() => {
  throw new Error('Abort')
}, 60000)
