import { IUser } from './../interfaces/user.interface'
import { Request, Response } from "express"
import UserModel from "../models/user.model"
import asyncHandler from 'express-async-handler'

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
  let _firstName: string, _lastName: string, _username: string, _dob: Date, _password: string

  if (!req.body.username || req.body.username == '') {
    res.status(400)
    throw new Error('Valid username required')
  } else {
    _username = req.body.username
  }

  if (!req.body.firstname || req.body.firstname == '') {
    res.status(400)
    throw new Error('Valid firstname required')
  } else {
    _firstName = req.body.firstname
  }

  if (!req.body.lastname || req.body.lastname == '') {
    res.status(400)
    throw new Error('Valid firstname required')
  } else {
    _lastName = req.body.lastname
  }

  if (!req.body.password || req.body.password == '') {
    res.status(400)
    throw new Error('Valid password required')
  } else {
    _password = req.body.password
  }

  if (!req.body.dob || req.body.dob == '') {
    res.status(400)
    throw new Error('Valid Date of Birth required')
  } else {
    _dob = new Date(req.body.dob)
  }

  let newUser: IUser = {
    username: _username,
    firstName: _firstName,
    lastName: _lastName,
    password: _password,
    dob: _dob,
    version: 1
  }

  try {
    const user = await UserModel.create(newUser)
    res.status(200).json({ message: 'User created successfully', user })
  } catch (err) {
    res.status(500).json({ message: 'Create user failed', err })
  }

})

// @desc    Update user
// @route   PUT /user
// @access  Private
export const editUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.body.id) {
    res.status(400)
    throw new Error('Valid user ID required')

  }

  let userEdits: Object[] = []

  if (req.body.username) {
    userEdits.push({ $set: { "username": req.body.username } })
  }

  if (req.body.firstname) {
    userEdits.push({ $set: { "firstName": req.body.firstname } })
  }

  if (req.body.lastname) {
    userEdits.push({ $set: { "lastName": req.body.lastname } })
  }

  if (req.body.password) {
    userEdits.push({ $set: { "password": req.body.password } })
  }

  if (req.body.dob) {
    userEdits.push({ $set: { "dob": new Date(req.body.dob) } })
  }

  console.log(req.body.id, userEdits)

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
export const deleteUser = async (req: Request, res: Response): Promise<void> => {

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
}

