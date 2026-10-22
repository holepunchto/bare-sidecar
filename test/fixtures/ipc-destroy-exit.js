Bare.IPC.on('close', () => {
  const deadline = Date.now() + 500

  while (Date.now() < deadline);

  Bare.exit(3)
}).destroy()
