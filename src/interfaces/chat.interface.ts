import { IMessage } from './message.interface'
import { Document, Types } from "mongoose"
import { IUser } from "./user.interface"

export interface IChat extends Document {
  readonly chatTitle: string
  readonly chatParticipants: Types.DocumentArray<IUser>
  readonly chatMessages: IMessage[]
  readonly createdOn: Date
  readonly createdBy: IUser
  readonly closedOn: Date
  readonly closedBy: IUser
}