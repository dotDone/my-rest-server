import { Application, Request, Response } from "express"

export default class MainRoutes {
  private app: Application
  constructor(app: Application) {
    this.app = app
    this.initMainRoutes()
  }

  private initMainRoutes() {
    this.app.get('/', (req: Request, res: Response): void => {
      res.setHeader('Content-Type', 'text/html')
      res.send('<h1>Hello World!</h1>')
    })
  }
}