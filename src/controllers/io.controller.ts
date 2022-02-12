import { createAdapter } from "@socket.io/mongo-adapter"
import { Connection } from "mongoose"
import * as socketio from "socket.io"
import { Server } from "../app"
export class IOController extends socketio.Server {

  private io: socketio.Server
  private db: Connection

  constructor(server: Server) {
    super()
    this.io = server.io
    this.db = server.connection
  }

  public static connectDbAdapter = async (io: socketio.Server, db: Connection) => {
    console.log(`${new Date().toTimeString()} : Adapter | Creating SocketIO x MongoDB adapter`)
    return io.adapter(createAdapter(db.collection(process.env.SOCKET_COLLECTION)))
  }

  public static logDisconnect(io: socketio.Server): void {
    console.log(`${new Date().toTimeString()} : SocketIO | Connection error logging started`)
    io.engine.on("connection_error", (err: { req: any; code: any; message: any; context: any }) => {
      console.log(err.req)
      console.log(err.code)
      console.log(err.message)
      console.log(err.context)
    })
  }

}