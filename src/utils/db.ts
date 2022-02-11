import { connect, connection, Connection } from "mongoose"
import UserModel from "../models/user.model"

export class Database {
  private url: string = `mongodb+srv://${process.env.MONGODB_ADDRESS}${process.env.MONGODB_DB}?retryWrites=true&w=majority`
  private myDb: Connection

  constructor() {
    this.db()
  }

  private async db(): Promise<void> {
    await connect(this.url, { user: process.env.MONGODB_USERNAME, pass: process.env.MONGODB_PASSWORD, family: 4, })
      .then((): void => console.log('Database connected successfully'))
      .catch((err: any): void => console.log(err))
      .finally((): Connection => this.myDb = connection)

  }

  private testQuery(): void {
    console.log(UserModel.find())
  }

  public getDb(): Connection {
    return this.myDb
  }

}