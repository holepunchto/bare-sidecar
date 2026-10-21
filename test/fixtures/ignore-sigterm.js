const Signal = require('bare-signals')

new Signal('SIGTERM').on('signal', () => {}).start()

Bare.IPC.write('ready')
