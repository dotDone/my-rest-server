import { Model, model, Schema, Types } from "mongoose"
import { IChat } from '../interfaces/chat.interface'
import { IMessage } from '../interfaces/message.interface'

type ChatDocumentOverrides = {
  chatMessages: Types.Subdocument<Types.ObjectId> & IMessage
}
type ChatModelType = Model<IChat, {}, ChatDocumentOverrides>

export const ChatSchema: Schema = new Schema<IChat, ChatModelType>({
  namespace: { type: String, required: true },
  room: { type: String, required: true },
  chatTitle: { type: String, required: true },
  chatParticipants: { type: [Schema.Types.ObjectId], required: true, ref: 'User' },
  chatMessages: { type: [Schema.Types.ObjectId], ref: 'Message' },
  createdOn: { type: Date, required: true },
  createdBy: { type: Schema.Types.ObjectId, required: true },
  closedOn: { type: Date },
  closedBy: { type: Schema.Types.ObjectId }
})

const ChatModel: Model<IChat, {}, ChatDocumentOverrides, {}> = model('Chat', ChatSchema)

export default ChatModel
