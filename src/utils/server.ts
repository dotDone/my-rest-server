import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from '../interfaces/io.interface'
import express from "express"
import * as http from 'http'
import * as socketio from "socket.io"
import cors from "cors"

export class ServerInitialiser {
  public static readonly PORT: number = 8080
  public app: express.Application
  public server: http.Server
  public io: socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>
  public port: string | number


  constructor() {
    this.config()
  }

  private config(): void {
    this.port = process.env.PORT || ServerInitialiser.PORT
  }

  public async build(): Promise<{ _app: express.Application; _io: socketio.Server }> {
    this.app = await this.createApp()
    await this.useCors(this.app)
    console.log(`${new Date().toTimeString()} : Express | Started`)
    this.server = await this.createServer(this.app)
    console.log(`${new Date().toTimeString()} : HTTP | Started`)
    this.io = await this.sockets(this.server)
    console.log(`${new Date().toTimeString()} : SocketIO | Started`)
    this.listen()
    const serverData: { _app: express.Application, _io: socketio.Server } = { _app: this.app, _io: this.io }
    console.log(`${new Date().toTimeString()} : Server | Build complete`)
    return serverData
  }

  private listen(): void {
    this.server.listen(this.port, () => console.log(`${new Date().toTimeString()} : Server | Listening on port: ${this.port}`))
  }

  private createApp = async () => express()

  private useCors = async (app: express.Application): Promise<express.Application> => app.use(cors())

  private createServer = async (app: express.Application): Promise<http.Server> => http.createServer(app)

  private sockets = async (server: http.Server): Promise<socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>> => new socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server)
}