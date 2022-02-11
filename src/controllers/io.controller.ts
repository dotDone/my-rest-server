import { createAdapter } from "@socket.io/mongo-adapter"
import { instrument } from "@socket.io/admin-ui"
import { AnyObject, Connection } from "mongoose"
import * as socketio from "socket.io"
import { Instance } from "../app"
import { IUser } from "../interfaces/user.interface"
export class IOController extends socketio.Server {

  private io: socketio.Server
  private db: Connection

  constructor(instance: Instance) {
    super()
    this.connectMongoAdapter()
    this.logDisconnect()
    this.testIO()
    this.io = instance.io
    this.db = instance.connection
    instrument(this.io, { auth: false })
  }

  private logDisconnect(): void {
    this.io.engine.on("connection_error", err => {
      console.log(err.req)
      console.log(err.code)
      console.log(err.message)
      console.log(err.context)
    })
  }

  private connectMongoAdapter(): void {
    this.io.adapter(createAdapter(this.db.collection<AnyObject>(process.env.SOCKET_COLLECTION)))
  }

  private testIO(): void {
    this.io.on('connection', socket => {
      console.log('User has connected')
      socket.emit('message', 'Hello from test.')
    })
  }

  public createRoom() {

  }

  public getSockets(user: IUser) {

  }


}