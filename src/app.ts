import { IOController } from './controllers/io.controller'
import express from "express"
import * as dotenv from "dotenv"
import * as socketio from "socket.io"
import { ServerInitialiser } from "./utils/server"
import { Database } from "./utils/db"
import { Connection } from "mongoose"
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './interfaces/io.interface'


dotenv.config()

export class Server {
  public _server: ServerInitialiser
  public connection: Connection
  public io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  public app: express.Application

  constructor() {
    this.setup()
  }

  private async setup(): Promise<void> {
    await this.startDb().catch(err => { console.log(`${new Date().toTimeString()} : MongoDB | Error establishing connection`); console.log(err) })
    await this.startServer().catch(err => { console.log(`${new Date().toTimeString()} : Server | Error creating server`); console.log(err) })
    this.startController()
  }

  private async startServer(): Promise<void> {
    console.log(`${new Date().toTimeString()} : Server | Building starting...`)
    this._server = new ServerInitialiser()
    await this._server.build()
      .then((e): void => { this.app = e._app; this.io = e._io })
      .catch(err => console.log(err))
  }

  private async startDb(): Promise<void> {
    let db: Database = new Database()
    await db.connectDb()
      .then(e => this.connection = e)
      .catch(err => console.log(err))
  }

  private async startController(): Promise<void> {
    await IOController.connectDbAdapter(this.io, this.connection)
    console.log(`${new Date().toTimeString()} : Adapter | SocketIO x MongoDB adapter created`)
    IOController.logDisconnect(this.io)
  }
}

const server: Server = new Server()
const controller: IOController = new IOController(server)

export default server

// const ioController = new IOController(server)
