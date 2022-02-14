import express from "express"
import { Connection, connect, connection } from "mongoose"
const dotenv = require('dotenv').config()
import * as socketio from "socket.io"
import * as http from 'http'
import cors from "cors"
import bodyParser from "body-parser"

// Interfaces
import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './interfaces/io.interface'

// Controllers
import { DBController } from './controllers/db.controller'
import { RoutesController } from './controllers/routes.controller'
import { IOController } from './controllers/io.controller'

export class Server {

  // Variables
  private url: string = `mongodb+srv://${process.env.MONGODB_ADDRESS}${process.env.MONGODB_DB}?retryWrites=true&w=majority`
  private PORT: string | number = process.env.PORT || 5000
  public db: Connection
  public app: express.Application
  public server: http.Server
  public io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  public socketController: IOController
  public dbController: DBController
  public routesController: RoutesController

  constructor() {
    this.startServer().then(() => this.startControllers()).catch(err => console.log(err))
  }

  // Private functions
  private startServer: () => Promise<void> = async (): Promise<void> => {
    this.app = express()
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Express | Application created`)
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({ extended: false }))
    this.app.use(RoutesController.errorHandler)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Express | Registered middleware`)
    this.server = http.createServer(this.app)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : HTTP | Server started`)
    this.io = new socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(this.server)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Socket | Server created`)
    await this.server.listen(this.PORT, () => console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Server | Listening on port ${this.PORT}`))
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
    this.routesController = new RoutesController(this.app)
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Controller | Created Routes Controller`)
  }
}

const server: Server = new Server()

export default server
