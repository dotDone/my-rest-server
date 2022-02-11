import express from "express"
import * as dotenv from "dotenv"
import * as socketio from "socket.io"
import { MyServer } from "./utils/server"
import { Database } from "./utils/db"
import { Connection } from "mongoose"

// start server
dotenv.config()

export class Instance {
  private server: MyServer
  constructor() {
    this.startServer()
  }

  private startServer() {
    this.server = new MyServer()
    this.io = this.server.getIo()
    this.app = this.server.getApp()
    this.connection = new Database().getDb()
  }

  public connection: Connection
  public io: socketio.Server
  public app: express.Application


}

const server: Instance = new Instance()

export default server

// const ioController = new IOController(server)

server.app.get('/', (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'text/html')
  res.send('<h1>Hello World!</h1>')
})