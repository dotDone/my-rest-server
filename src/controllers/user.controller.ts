import { IUser } from './../interfaces/user.interface'
import { Request, Response } from "express"
import UserModel from "../models/user.model"
import asyncHandler from 'express-async-handler'

// @desc    Get users
// @route   GET /user
// @access  Private
export const getUsers = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const results = await UserModel.find()
  const jsonResults = []
  results.forEach(e => jsonResults.push(e.toJSON()))
  res.status(200).json(jsonResults)
})

// @desc    Get user
// @route   GET /user/:id
// @access  Private
export const getUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  if (!req.params.id) {
    res.status(400)
    throw new Error('User ID required')
  }

  await UserModel.findById(req.params.id, {}, {}, (err, user): void => {
    err ? res.status(400).json({ message: `Couldn't find user`, err }) : res.status(200).json({ message: 'Success!!', user })
  }).clone()

  // REMOVE .clone()
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

  UserModel.create(newUser, (err, user): void => {
    err ? res.status(500).json({ message: 'Create user failed', err }) : res.status(200).json({ message: 'User created successfully', user })
  })
})

// @desc    Update user
// @route   PUT /user/:id
// @access  Private
export const editUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {

  let userEdits = []

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

  console.log(req.params.id, userEdits)

  await UserModel.findByIdAndUpdate(req.params.id, userEdits, { new: true }, (err, user) => {
    err ? res.status(400).json({ message: 'Could not update user', err }) : res.status(200).json({ message: `Update User ${req.params.id} successfully`, user })
  }).clone()
})

// @desc    Delete user
// @route   DELETE /user/:id
// @access  Private
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({ message: `Delete User ${req.params.id}` })
}

