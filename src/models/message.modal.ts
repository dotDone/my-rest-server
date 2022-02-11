import { Model, model, Schema, Types } from "mongoose"
import { IMessage } from './../interface/message.interface'

type MessageModelType = Model<IMessage, {}, {}, {}>

export const MessageSchema: Schema = new Schema<IMessage, MessageModelType>({
  chatId: { type: Types.ObjectId, required: true },
  sender: { type: Types.ObjectId, required: true },
  timestamp: { type: Date, required: true },
  messageContent: { type: String, required: true }

})

const MessageModel: Model<IMessage> = model('Message', MessageSchema)

export default MessageModel