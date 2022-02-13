import { IMessage } from './message.interface'
import { Document, Types } from "mongoose"
import { IUser } from "./user.interface"

export interface IChat extends Document {
  readonly _id: Types.ObjectId
  readonly namespace: string
  readonly room: String
  readonly chatTitle: string
  readonly chatParticipants: Types.DocumentArray<IUser>
  readonly chatMessages: Types.DocumentArray<IMessage>
  readonly createdOn: Date
  readonly createdBy: IUser
  readonly closedOn: Date
  readonly closedBy: IUser
}