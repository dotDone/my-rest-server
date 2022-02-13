import { IChat } from './chat.interface'

import { Date, Document, Types } from "mongoose"

export interface IUser extends Document {
  readonly _id: Types.ObjectId
  readonly username: string
  readonly firstName: string
  readonly lastName: string
  readonly dob: Date
  readonly createdOn: Date
  readonly version: number
  readonly rooms: IChat[]
}