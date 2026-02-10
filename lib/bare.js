const fs = require('fs')

require.asset = require('require-asset')

let bare
try {
  bare = require.asset('#bare', __filename)
} catch {
  bare = require.asset('#bare-universal', __filename)
}

try {
  fs.accessSync(bare, fs.constants.X_OK)
} catch {
  fs.chmodSync(bare, 0o755)
}

module.exports = bare
