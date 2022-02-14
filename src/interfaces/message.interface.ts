import { Date, Document, Types } from "mongoose"

export interface IMessage extends Document {
  readonly _id: Types.ObjectId
  readonly chatId: Types.ObjectId
  readonly sender: Types.ObjectId
  readonly messageContent: string
}