import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../interfaces/io.interface'
import express from "express"
import * as http from 'http'
import * as socketio from "socket.io"
import cors from "cors"

export class MyServer {
  public static readonly PORT: number = 8080
  private app: express.Application
  private server: http.Server
  private io: socketio.Server
  private port: string | number

  constructor() {
    this.createApp()
    this.config()
    this.createServer()
    this.sockets()
    this.listen()
  }

  private createApp(): void {
    this.app = express()
    this.app.use(cors())
  }

  private createServer(): void {
    this.server = http.createServer(this.app)
  }

  private config(): void {
    this.port = process.env.PORT || MyServer.PORT
  }

  private sockets(): void {
    this.io = new socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(this.server)
  }

  private listen(): void {
    this.server.listen(this.port, () => console.log(`Server started listening on port: ${this.port}`))
  }

  public getApp(): express.Application {
    return this.app
  }

  public getIo(): socketio.Server {
    return this.io
  }

}