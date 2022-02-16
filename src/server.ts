import express from 'express'
import { Connection, connections, connect } from 'mongoose'
import * as socketio from 'socket.io'
import * as http from 'http'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from "dotenv"

import { ServerToClientEvents, ClientToServerEvents, InterServerEvents, SocketData } from './interfaces/io.interface'
import { RoutesController } from './controllers/routes.controller'
import { IOController } from './controllers/io.controller'
import { DBController } from './controllers/db.controller'

dotenv.config()

const url: string = `mongodb+srv://${process.env.MONGODB_ADDRESS}${process.env.MONGODB_DB}?retryWrites=true&w=majority`

const PORT: string | number = process.env.PORT || 5000

const server = async () => {
  const app: express.Application = express()
  console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Server | Server starting...`)
  app.use(cors())

  app.use(bodyParser.urlencoded({ extended: true }))

  const server: http.Server = http.createServer(app)

  const io: socketio.Server = new socketio.Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(server)

  console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Server | Server started`)

  server.listen(PORT, () => console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Server | Listening on port ${PORT}`))

  let db: Connection

  try {
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : DB | Connecting to MongoDB...`)
    await connect(url, { user: process.env.MONGODB_USERNAME, pass: process.env.MONGODB_PASSWORD, family: 4, })
    db = connections[0]
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : DB | Connection established`)
  } catch (err) {
    console.log(err)
  }

  console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Controller | Creating controllers...`)
  const routesController: RoutesController = new RoutesController(app)
  const ioController: IOController = new IOController(io, db)
  const dbController: DBController = new DBController(db, io)
  console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : Controller | Controllers ready`)

  return { app, io, db }
}

server()