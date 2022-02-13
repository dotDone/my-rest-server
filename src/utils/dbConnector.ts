import { connect, connection, Connection } from "mongoose"
import UserModel from "../models/user.model"

export class Database {
  private url: string = `mongodb+srv://${process.env.MONGODB_ADDRESS}${process.env.MONGODB_DB}?retryWrites=true&w=majority`
  private myDb: Connection

  constructor() { }

  public async connectDb(): Promise<Connection> {
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : MongoDB | Establishing connection...`)
    await connect(this.url, { user: process.env.MONGODB_USERNAME, pass: process.env.MONGODB_PASSWORD, family: 4, })
    console.log(`${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} : MongoDB | Connection established`)
    this.myDb = connection
    return connection
  }

  private testQuery(): void {
    console.log(UserModel.find())
  }
}