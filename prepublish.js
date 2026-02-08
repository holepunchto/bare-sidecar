const fs = require('fs')
const path = require('path')

const prebuilds = path.join(__dirname, 'prebuilds')

function makeExecutable(dir) {
  if (!fs.existsSync(dir)) return

  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    const entry = path.join(dir, item.name)

    if (item.isDirectory()) {
      makeExecutable(entry)
    } else if (item.isFile()) {
      fs.chmodSync(entry, 0o755)
    }
  }
}

makeExecutable(prebuilds)
