import { Model, model, Schema, Types } from "mongoose"
import { IMessage } from '../interfaces/message.interface'

type MessageModelType = Model<IMessage, {}, {}, {}>

export const MessageSchema: Schema = new Schema<IMessage, MessageModelType>({
  chatId: { type: Schema.Types.ObjectId, required: true },
  sender: { type: Schema.Types.ObjectId, required: true },
  messageContent: { type: String, required: true }
}, { timestamps: true })

const MessageModel: Model<IMessage> = model('Message', MessageSchema)

export default MessageModel