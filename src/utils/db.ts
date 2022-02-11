import { connect, Connection } from "mongoose"

export class Database {
  private url: string = `mongodb+srv://${process.env.MONGODB_ADDRESS}${process.env.MONGODB_DB}?retryWrites=true&w=majority`
  private myDb

  constructor() {
    this.db()
  }

  private async db(): Promise<void> {
    await connect(this.url, { user: process.env.MONGODB_USERNAME, pass: process.env.MONGODB_PASSWORD }).then(() => console.log('Database connected successfully')).catch(err => console.log(err))
  }

  public getDb(): Connection {
    return this.myDb
  }

}