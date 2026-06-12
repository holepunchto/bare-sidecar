import Pipe from 'bare-pipe'
import { Duplex, DuplexEvents } from 'bare-stream'

interface SidecarEvents extends DuplexEvents {
  exit: [code: number | null, signalCode: string | null]
}

interface SidecarOptions {}

interface Sidecar<M extends SidecarEvents = SidecarEvents> extends Duplex<M> {
  readonly stdin: Pipe | null
  readonly stdout: Pipe | null
  readonly stderr: Pipe | null
}

declare class Sidecar<M extends SidecarEvents = SidecarEvents> extends Duplex<M> {
  constructor(entry: string, args?: string[], opts?: SidecarOptions)
  constructor(entry: string, opts?: SidecarOptions)
}

declare namespace Sidecar {
  export { type SidecarEvents, type SidecarOptions, Sidecar }
}

export = Sidecar
