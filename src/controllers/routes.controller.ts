import asyncHandler from 'express-async-handler'
import { Application, NextFunction, Request, Response } from 'express'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Types } from 'mongoose'

import mainRouter from '../routes/main.routes'
import userRouter from '../routes/user.router'
import authRouter from '../routes/auth.router'
import UserModel from '../models/user.model'

export interface IGetUserAuthInfoRequest extends Request {
  user: any
}
export class RoutesController {
  private app: Application

  constructor(app: Application) {
    this.app = app
    this.startRoutesController()
  }

  private startRoutesController(): void {
    this.app.use('/', mainRouter)
    this.app.use('/user', userRouter)
    this.app.use('/login', authRouter)
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

  public static protect = asyncHandler(
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
          console.log(decoded)
          req.user = await UserModel.findById(decoded.id).select('-password')
          console.log(req.user)
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
  );
}
