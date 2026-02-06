# bare-sidecar

Start and manage Bare sidecar processes from Node.js and Electron.

```
npm i bare-sidecar
```

## Usage

```js
const Sidecar = require('bare-sidecar')

const sidecar = new Sidecar('./entry')

sidecar.on('data', console.log).write('Hello sidecar')
```

## License

Apache-2.0
