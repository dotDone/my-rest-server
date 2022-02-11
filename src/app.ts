import express from "express"
import * as dotenv from "dotenv"
import * as socketio from "socket.io"
import { MyServer } from "./utils/server"
import { Database } from "./utils/db"
import { Connection } from "mongoose"
import { createAdapter } from "@socket.io/mongo-adapter"

// start server
dotenv.config()

export class Instance {
  private server: MyServer
  public connection: Connection
  public io: socketio.Server
  public app: express.Application
  constructor() {
    this.startServer()
    console.log(this.connection)
    this.logDisconnect()
  }

  private async startServer() {
    this.server = new MyServer()
    this.io = this.server.getIo()
    this.app = this.server.getApp()
    this.connection = await this.getConnection()
  }

  private getConnection: () => Promise<Connection> = async (): Promise<Connection> => {
    return new Database().getDb()
  }

  private connectDbAdapter = async () => {
    return this.io.adapter(createAdapter(this.connection.collection(process.env.SOCKET_COLLECTION)))
  }

  private logDisconnect(): void {
    this.io.engine.on("connection_error", err => {
      console.log(err.req)
      console.log(err.code)
      console.log(err.message)
      console.log(err.context)
    })
  }




}

const server: Instance = new Instance()

export default server

// const ioController = new IOController(server)

server.app.get('/', (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'text/html')
  res.send('<h1>Hello World!</h1>')
})