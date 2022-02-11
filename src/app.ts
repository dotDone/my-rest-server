import express from "express"
import * as dotenv from "dotenv"
import * as SocketIO from "socket.io"
import { MyServer } from "./utils/server"
import { Database } from "./utils/db"
import { Connection } from "mongoose"

// start server
dotenv.config()

class Instance {
  private server: MyServer
  constructor() {
    this.startServer()
  }

  private async startServer() {
    this.server = new MyServer()
    this.io = this.server.getIo()
    this.app = this.server.getApp()
    this.connection = new Database().getDb()
  }

  public connection: Connection
  public io: SocketIO.Server
  public app: express.Application
}

const server: Instance = new Instance()

export default server