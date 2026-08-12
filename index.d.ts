import Pipe from 'bare-pipe'
import { Duplex, DuplexEvents } from 'bare-stream'

interface SidecarEvents extends DuplexEvents {
  exit: [code: number | null, signalCode: string | null]
}

interface SidecarOptions {}

interface Sidecar<M extends SidecarEvents = SidecarEvents> extends Duplex<M> {
  /** The writable standard input stream of the underlying process. */
  readonly stdin: Pipe | null
  /** The readable standard output stream of the underlying process. */
  readonly stdout: Pipe | null
  /** The readable standard error stream of the underlying process. */
  readonly stderr: Pipe | null
}

declare class Sidecar<M extends SidecarEvents = SidecarEvents> extends Duplex<M> {
  /**
   * @param entry - Path to the module the sidecar process runs, typically resolved with
   * `require.resolve()`.
   * @param args - Additional command-line arguments passed to the process (default `[]`).
   * @param opts - Reserved for future use.
   */
  constructor(entry: string, args?: string[], opts?: SidecarOptions)
  constructor(entry: string, opts?: SidecarOptions)
}

/**
 * Spawn a bundled Bare runtime running `entry` and return a `Sidecar`. `entry` is the path to the
 * module to run, typically resolved with `require.resolve()`. `args` is an array of additional
 * command line arguments passed to the process. `options` is reserved for future use.
 */
declare namespace Sidecar {
  export { type SidecarEvents, type SidecarOptions, Sidecar }
}

export = Sidecar
