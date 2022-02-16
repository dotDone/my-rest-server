import { Model, model, Schema, Types } from "mongoose"

export interface IUser {
  username: string
  email: string
  password: string
  version: number
  rooms?: Types.ObjectId[]
}

type UserDocumentOverrides = {}

type UserModelType = Model<IUser, {}, UserDocumentOverrides>


export const UserSchema: Schema = new Schema<IUser, UserModelType>({
  username: { type: String, required: [true, 'Username required'], unique: true },
  email: { type: String, required: [true, 'Email address required'], unique: true },
  password: { type: String, required: [true, 'Password required'] },
  version: { type: Number, required: [true, 'Version number required'] },
  rooms: { type: [Schema.Types.ObjectId], required: false }
}, { timestamps: true, })

const UserModel: Model<IUser, {}, UserDocumentOverrides, {}> = model('User', UserSchema)

export default UserModel