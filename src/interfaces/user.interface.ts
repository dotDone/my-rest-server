import { Types } from "mongoose"

export interface IUser {
  username: string
  firstName: string
  lastName: string
  password: string
  dob: Date
  version: number
  rooms?: Types.ObjectId[]
}