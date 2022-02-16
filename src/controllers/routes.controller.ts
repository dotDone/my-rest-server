import asyncHandler from 'express-async-handler'
import { Application, NextFunction, Request, Response, Router } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'
import bcrypt from 'bcryptjs'


import UserModel, { IUser } from '../models/user.model'
import UserRoutes from '../routes/user.routes'
import MainRoutes from '../routes/main.routes'

export interface IGetUserAuthInfoRequest extends Request {
  user: any
}
export class RoutesController {
  private app: Application
  private router: Router

  private routesController: RoutesController

  constructor(app: Application) {
    this.app = app
    this.routesController
    this.router = Router()
    this.initAllRoutes()
  }

  private initAllRoutes(): void {
    this.initMainRoutes()
    this.initUserRoutes()
  }

  private initMainRoutes() {
    const mainRoutes: MainRoutes = new MainRoutes(this.app)
    return mainRoutes
  }

  private initUserRoutes() {
    const userRoutes: UserRoutes = new UserRoutes()
    this.app.use('/user', userRoutes.router)
    return userRoutes
  }


  public static errorHandler = (
    err: any,
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    const statusCode = res.statusCode ? res.statusCode : 500

    res.status(statusCode)

    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    })
  };

  public static generateToken = (id: Types.ObjectId): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '60d' })
  };


}

export const protect = asyncHandler(
  async (
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    let token: string

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      try {
        token = req.headers.authorization.split(' ')[1]

        const decoded: JwtPayload = jwt.verify(
          token,
          process.env.JWT_SECRET,
          { complete: true },
        )
        console.log("Decoded:", decoded)
        req.user = await UserModel.findById(decoded.payload.id).select('-password')
        console.log("Req.user:", req.user)
        next()
      } catch (err) {
        console.log(err)
        res.status(401)
        throw new Error('Not authorised')
      }
    }
    if (!token) {
      res.status(401)
      throw new Error('Not a valid token')
    }
  },
)
