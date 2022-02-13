import { Types } from 'mongoose'
export interface ServerToClientEvents {
  noArg: () => void
  basicEmit: (a: number, b: string, c: Buffer) => void
  withAck: (d: string, callback: (e: number) => void) => void
  test: (msg: string) => void
}

export interface ClientToServerEvents {
  message: () => void
  join: () => void
  findRoom: () => void
}

export interface InterServerEvents {
  ping: () => void
}

export interface SocketData {
  _id: Types.ObjectId
}

