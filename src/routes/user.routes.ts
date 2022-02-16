import asyncHandler from 'express-async-handler'
import { Request, Response, Router } from "express"
import bcrypt from 'bcryptjs'
import { RoutesController, IGetUserAuthInfoRequest, protect } from "../controllers/routes.controller"
import UserModel, { IUser } from '../models/user.model'

export default class UserRoutes {
  public router: Router

  constructor() {
    this.router = Router()
    this.initUserRoutes()
  }

  private initUserRoutes() {
    this.router.route('/').get(protect, this.getUsers).put(protect, this.editUser).delete(protect, this.deleteUser)
    this.router.route('/me').get(protect, this.getMe)
    this.router.route('/login').post(this.login)
    this.router.route('/register').post(this.createUser)
    return this.router
  }

  // @desc    Get users
  // @route   GET /user
  // @access  Private
  private getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    if (req.body.id) {
      try {
        const user = await UserModel.findById(req.body.id)
        res.status(200).json({ message: 'Success!!', user })
      } catch (err) {
        res.status(400).json({ message: `Couldn't find user`, err })
      }
    } else {
      const results = await UserModel.find()
      res.status(200).json(results)
    }
  })

  // @desc    Register
  // @route   POST /user/register
  // @access  Public
  private createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const { username, email, password } = req.body

    if (!username || !password || !email) {
      res.status(400)
      throw new Error('All fields required')
    }

    const checkUserExists = await UserModel.find({ email: email }, {}, { rawResult: true })

    if (checkUserExists.length !== 0) {
      throw new Error('User already exists')
    }


    const checkUsername = await UserModel.find({ username: username }, {}, { rawResult: true })

    console.log(checkUsername)

    if (checkUsername.length !== 0) {
      throw new Error('Username is taken')
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    let newUser: IUser = {
      username: username,
      email: email,
      password: hashedPassword,
      version: 1
    }

    try {
      const user = await UserModel.create(newUser)
      res.status(201).json({ message: 'User created successfully', id: user._id, username: user.username, email: user.email, token: RoutesController.generateToken(user._id) })
    } catch (err) {
      res.status(500).json({ message: 'User create failed', err })
    }
  })

  // @desc    Update user
  // @route   PUT /user
  // @access  Private
  private editUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    const { id, username, email, password } = req.body

    if (!id) {
      res.status(400)
      throw new Error('Valid user ID required')
    }

    let userEdits: Object[] = []

    if (username) {
      userEdits.push({ $set: { "username": username } })
    }

    if (email) {
      userEdits.push({ $set: { "email": email } })
    }

    if (password) {
      userEdits.push({ $set: { "password": password } })
    }

    console.log(id, userEdits)

    try {
      const user = await UserModel.findByIdAndUpdate(req.body.id, userEdits, { new: true })
      res.status(200).json({ message: `Update User ${req.body.id} successfully`, user })
    } catch (err) {
      res.status(400).json({ message: 'Could not update user', err })
    }
  })

  // @desc    Delete user
  // @route   DELETE /user
  // @access  Private
  private deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

    if (!req.body.id) {
      res.status(400)
      throw new Error('Valid user ID required')
    }

    try {
      const user = await UserModel.findByIdAndDelete(req.body.id)
      res.status(200).json({ message: `Deleted User ${req.body.id} successfully`, user })
    } catch (err) {
      res.status(400).json({ message: 'Could not delete user', err })
    }
  })

  // @desc    Get me
  // @route   GET /user/me
  // @access  Private
  private getMe = asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    res.status(200).json(req.user)
  })

  // @desc    Login
  // @route   POST /user/login
  // @access  Public
  private login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

}