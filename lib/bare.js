const fs = require('fs')

require.asset = require('require-asset')

const bare = require.asset('#bare', __filename)

try {
  fs.accessSync(bare, fs.constants.X_OK)
} catch {
  fs.chmodSync(bare, 0o755)
}

module.exports = bare
