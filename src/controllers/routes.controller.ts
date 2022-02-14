import { Application, Request, Response } from "express"
import mainRouter from '../routes/main.routes'
import userRouter from "../routes/user.router"

export class RoutesController {

  private app: Application

  constructor(app: Application) {
    this.app = app
    this.startRoutesController()

  }

  private startRoutesController(): void {
    this.app.use('/', mainRouter)
    this.app.use('/user', userRouter)
  }

  public static errorHandler = (err: any, req: Request, res: Response, next): void => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack
    })
  }
}


