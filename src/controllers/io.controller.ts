import { IChat } from './../interfaces/chat.interface'
import { IUser } from './../interfaces/user.interface'
import { createAdapter } from "@socket.io/mongo-adapter"
import { Connection, Types } from "mongoose"
import * as socketio from "socket.io"
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../interfaces/io.interface'
import UserModel from '../models/user.model'
import ChatModel from '../models/chat.model'


export class IOController {
  // Variables
  private io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  private db: Connection
  private onlineClients: Set<IUser> = new Set()

  constructor(io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>, db: Connection) {
    this.io = io
    this.db = db

    this.onStart()
    this.onConnection()
  }

  // Private functions
  private onStart() {
    this.io.adapter(createAdapter(this.db.collection(process.env.SOCKET_COLLECTION)))
    this.io.engine.on("connection_error", (err: { req: any; code: any; message: any; context: any }) => {
      console.log(err.req)
      console.log(err.code)
      console.log(err.message)
      console.log(err.context)
    })
  }

  private onConnection(): void {
    this.io.on('connection', (socket): void => {
      console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Socket ${socket.id} has connected`)
      socket.on('disconnect', () => {
        console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : IOController | Socket ${socket.id} has disconnected`)
      })
    })
  }

  private onDisconnect(): void {

  }

  /**
   * joinRoom 
   */
  public static joinRoom = async (id: socketio.Socket, user: IUser, room?: string): Promise<void> => {
    const usersRooms: string[] = []
    await ChatModel.find({ chatParticipants: [user] }, (err, res) => err ? console.log(err) : res.forEach((u): number => usersRooms.push(u.room.toString())))

    if (!room) {
      id.join(usersRooms)
    } else {
      usersRooms.push(room)
      id.join(usersRooms)
    }
  }
}

