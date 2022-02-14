import { Document, Types } from "mongoose"

export interface IChat extends Document {
  readonly _id: Types.ObjectId
  readonly namespace: string
  readonly room: String
  readonly chatTitle: string
  readonly chatParticipants: Types.ObjectId[]
  readonly chatMessages?: Types.ObjectId[]
  readonly createdOn: Date
  readonly createdBy: Types.ObjectId
  readonly closedOn?: Date
  readonly closedBy?: Types.ObjectId
}