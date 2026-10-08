Bare.IPC.on('data', (data) => {
  console.log('x'.repeat(1024 * 1024))
  Bare.IPC.write(data)
})
