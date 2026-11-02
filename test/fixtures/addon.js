const os = require('bare-os')

Bare.IPC.end(os.platform() + '-' + os.arch())
