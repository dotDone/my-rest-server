import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import bcrypt from 'bcryptjs'


import UserModel from "../models/user.model"
import { RoutesController } from "./routes.controller"


// @desc    Login
// @route   POST /login
// @access  Public
export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await UserModel.findOne({ email: email })

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        username: user.username,
        token: RoutesController.generateToken(user._id),
      })
    } else {
      res.status(400).json({ message: 'Invalid credentials' })
    }
  } catch (err) {
    res.status(500).json({ message: 'Could not complete request', err })
  }
})

