import { Model, model, Schema, Types, Date } from "mongoose"

export interface IMessage {
  readonly _id: Types.ObjectId
  readonly chatId: Types.ObjectId
  readonly sender: Types.ObjectId
  readonly messageContent: string
}

type MessageModelType = Model<IMessage, {}, {}, {}>

export const MessageSchema: Schema = new Schema<IMessage, MessageModelType>({
  chatId: { type: Schema.Types.ObjectId, required: true },
  sender: { type: Schema.Types.ObjectId, required: true },
  messageContent: { type: String, required: true }
}, { timestamps: true })

const MessageModel: Model<IMessage> = model('Message', MessageSchema)

export default MessageModel