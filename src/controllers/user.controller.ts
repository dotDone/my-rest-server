import { Request, Response } from "express"
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'

import { IUser } from './../interfaces/user.interface'
import { IGetUserAuthInfoRequest, RoutesController } from "./routes.controller"
import UserModel from "../models/user.model"

// @desc    Get users
// @route   GET /user
// @access  Private
export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (req.body.id) {
    try {
      const user = await UserModel.findById(req.body.id)
      res.status(200).json({ message: 'Success!!', user })
    } catch (err) {
      res.status(400).json({ message: `Couldn't find user`, err })
    }
  }

  const results = await UserModel.find()
  res.status(200).json(results)
})

// @desc    Create user
// @route   POST /user
// @access  Private
export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  const { username, firstName, lastName, email, password, dob, } = req.body

  if (!username || !firstName || !lastName || !password || !dob || !email) {
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
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: hashedPassword,
    dob: dob,
    version: 1
  }

  try {
    const user = await UserModel.create(newUser)
    res.status(201).json({ message: 'User created successfully', username: user.username, token: RoutesController.generateToken(user._id) })
  } catch (err) {
    res.status(500).json({ message: 'User create failed', err })
  }
})

// @desc    Update user
// @route   PUT /user
// @access  Private
export const editUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  const { id, username, firstName, lastName, email, password, dob } = req.body

  if (!id) {
    res.status(400)
    throw new Error('Valid user ID required')
  }

  let userEdits: Object[] = []

  if (username) {
    userEdits.push({ $set: { "username": username } })
  }

  if (firstName) {
    userEdits.push({ $set: { "firstName": firstName } })
  }

  if (lastName) {
    userEdits.push({ $set: { "lastName": lastName } })
  }

  if (email) {
    userEdits.push({ $set: { "email": email } })
  }

  if (password) {
    userEdits.push({ $set: { "password": password } })
  }

  if (dob) {
    userEdits.push({ $set: { "dob": new Date(dob) } })
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
export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

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
export const getMe = asyncHandler(async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
  res.status(200).json(req.user)
})
