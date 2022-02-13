import express from "express"
import { Connection, connect, connection } from "mongoose"
const dotenv = require('dotenv').config()
import * as socketio from "socket.io"
import * as http from 'http'
import cors from "cors"

// Interfaces
import IOController from './controllers/io.controller'
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './interfaces/io.interface'

// Controllers
import { DBController } from './controllers/db.controller'

export class Server {

  // Variables
  private url: string = `mongodb+srv://${process.env.MONGODB_ADDRESS}${process.env.MONGODB_DB}?retryWrites=true&w=majority`
  public db: Connection
  public app: express.Application
  public server: http.Server
  public io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  public socketController: IOController
  public dbController: DBController

  constructor() {
    this.startServer().then(() => this.startControllers()).catch(err => console.log(err))
  }

  // Private functions
  private startServer: () => Promise<void> = async (): Promise<void> => {
    this.app = express()
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Express | Application created`)
    this.app.use(cors())
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Express | Application using cors`)
    this.server = http.createServer(this.app)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : HTTP | Server started`)
    this.io = new socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(this.server)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Socket | Server created`)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : DB | Establishing connection...`)
    await connect(this.url, { user: process.env.MONGODB_USERNAME, pass: process.env.MONGODB_PASSWORD, family: 4, })
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : DB | Connection established`)
    this.db = connection
  }

  private startControllers(): void {
    this.socketController = new IOController(this.io, this.db)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Controller | Created IO Controller`)
    this.dbController = new DBController(this.db, this.io)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Controller | Created DB Controller`)
  }
}

const server: Server = new Server()

export default server