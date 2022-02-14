import { createAdapter } from "@socket.io/mongo-adapter"
import { Connection } from "mongoose"
import { Server } from "socket.io"

export class DBController {
  private db: Connection
  private io: Server

  constructor(db: Connection, io: Server) {
    this.io = io
    this.db = db
    this.startController()
  }


  private startController() {
    this.db.once("open", (): void => {

    })
  }

}