import URL from 'bare-url'
import Pipe from 'bare-pipe'
import { Duplex, DuplexEvents } from 'bare-stream'

interface SidecarEvents extends DuplexEvents {
  exit: [code: number | null, signalCode: string | null]
}

type SidecarStdio = 'pipe' | 'inherit' | 'ignore'

interface SidecarOptions {
  detached?: boolean
  /**
   * How to set up standard input, output, and error of the underlying process, either for all
   * three at once or per stream (default `'pipe'`). Piped output must be read, or the sidecar
   * will block once the pipe buffer fills.
   */
  stdio?: SidecarStdio | [stdin?: SidecarStdio, stdout?: SidecarStdio, stderr?: SidecarStdio]
}

interface Sidecar<M extends SidecarEvents = SidecarEvents> extends Duplex<M> {
  /** The writable standard input stream of the underlying process. */
  readonly stdin: Pipe | null
  /** The readable standard output stream of the underlying process. */
  readonly stdout: Pipe | null
  /** The readable standard error stream of the underlying process. */
  readonly stderr: Pipe | null

  /**
   * Send `signal` to the underlying process, such as `'SIGKILL'` to force down a sidecar that
   * `destroy()` is still waiting on. The sidecar closes once the process has exited.
   * @param signal - The signal to send, by name or number (default `'SIGTERM'`).
   * @returns Whether the signal was sent.
   */
  kill(signal?: string | number): boolean
}

declare class Sidecar<M extends SidecarEvents = SidecarEvents> extends Duplex<M> {
  /**
   * @param entry - Path or `file:` URL of the module the sidecar process runs, typically resolved
   * with `require.resolve()` or `import.meta.resolve()`.
   * @param args - Additional command-line arguments passed to the process (default `[]`).
   * @param opts - Spawn options, see `SidecarOptions`.
   */
  constructor(entry: string | URL, args?: string[], opts?: SidecarOptions)
  constructor(entry: string | URL, opts?: SidecarOptions)
}

/**
 * Spawn a bundled Bare runtime running `entry` and return a `Sidecar`. `entry` is the path or
 * `file:` URL of the module to run, typically resolved with `require.resolve()`. `args` is an array of additional
 * command line arguments passed to the process. `options` controls how the process is spawned.
 */
declare namespace Sidecar {
  export { type SidecarEvents, type SidecarOptions, type SidecarStdio, Sidecar }
}

export = Sidecar
