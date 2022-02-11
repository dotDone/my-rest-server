import { IUser } from './user.interface'
import { IChat } from './chat.interface'
import { Date, Document, Types } from "mongoose"

export interface IMessage extends Document {
  readonly _id: Types.ObjectId
  readonly chatId: IChat
  readonly sender: IUser
  readonly timestamp: Date
  readonly messageContent: string
}