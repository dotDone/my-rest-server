import { IChat } from './../interfaces/chat.interface'
import { IUser } from './../interfaces/user.interface'
import { createAdapter } from "@socket.io/mongo-adapter"
import { Connection, Types } from "mongoose"
import * as socketio from "socket.io"
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../interfaces/io.interface'
import UserModel from '../models/user.model'
import ChatModel from '../models/chat.model'


export class IOController extends socketio.Server {
  constructor(io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, connection: Connection) {
    super()
    this.io = io
    this.db = connection
    this.onConnection()
  }

  // Variables
  private io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  private db: Connection
  private onlineClients: Set<IUser> = new Set()

  // Private functions
  private async onConnection() {
    this.io.on('connection', (socket) => {
      console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Socket ${socket.id} has connected`)
      const userId: Types.ObjectId = socket.handshake.auth._id
      let _user: IUser & { _id: Types.ObjectId }
      UserModel.findById(userId).exec((err, user) => { err ? console.log(err) : _user = user })
      console.log(socket.handshake)
    })
  }

  private joinRoom = async (id: socketio.Socket, user: IUser, room?: string) => {
    const usersRooms: string[] = []
    await ChatModel.find({ chatParticipants: [user] }, (err, res) => err ? console.log(err) : res.forEach(u => usersRooms.push(u.room.toString())))

    if (!room) {
      id.join(usersRooms)
    } else {
      usersRooms.push(room)
      id.join(usersRooms)
    }
  }

  // Public functions
  public connectDbAdapter = async (io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, db: Connection) => {
    // console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Creating SocketIO x MongoDB adapter...`)
    return io.adapter(createAdapter(db.collection(process.env.SOCKET_COLLECTION)))
  }

  public logDisconnect(io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>): void {
    // console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Connection error logging started`)
    io.engine.on("connection_error", (err: { req: any; code: any; message: any; context: any }) => {
      console.log(err.req)
      console.log(err.code)
      console.log(err.message)
      console.log(err.context)
    })
  }

  //   public onConnectionEvents(socket: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>): void {
  //     socket.on("connection", (socket): void => {
  //       console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Socket ${socket.id} has connected`)
  //       this.onlineClients.add(socket.id)
  //       socket.emit("test", "This is a test message")

  //       socket.on("disconnect", (): void => {
  //         this.onlineClients.delete(socket.id)
  //         console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Socket ${socket.id} has disconnected`)
  //       })

  //       socket.on("hello", () =>
  //         console.info(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Socket ${socket.id} says hello!`))

  //       socket.emit("withAck", "Welcome!!", (e: number): void => { })
  //     })
  //     console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Listening for connection events...`)
  //   }


}