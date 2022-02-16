import { Model, model, Schema, Types } from "mongoose"
import { IMessage } from "./message.modal"

export interface IChat {
  readonly _id: Types.ObjectId
  readonly namespace: string
  readonly room: String
  readonly chatTitle: string
  readonly chatParticipants: Types.ObjectId[]
  readonly chatMessages?: Types.ObjectId[]
  readonly createdBy: Types.ObjectId
  readonly closedOn?: Date
  readonly closedBy?: Types.ObjectId
}

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
  createdBy: { type: Schema.Types.ObjectId, required: true },
  closedOn: { type: Date },
  closedBy: { type: Schema.Types.ObjectId }
}, { timestamps: true })

const ChatModel: Model<IChat, {}, ChatDocumentOverrides, {}> = model('Chat', ChatSchema)

export default ChatModel
