import { connect, Connection } from "mongoose"
export class Database {
  private url: string = `mongodb+srv://${process.env.MONGODB_ADDRESS}?retryWrites=true&w=majority`
  private myDb: Connection

  constructor() {
    try {
      this.db()
      console.log(`Database connected successfully!`)
    } catch (err) {
      console.error(err)
    }
  }

  private async db(): Promise<void> {
    const test = await connect(this.url, { user: process.env.MONGODB_USERNAME, pass: process.env.MONGODB_PASSWORD })
    this.myDb = test.connection
  }


  public getDb(): Connection {
    return this.myDb
  }

}