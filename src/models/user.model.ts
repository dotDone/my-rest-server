import { Model, model, Schema } from "mongoose"
import { IUser } from "../interfaces/user.interface"

type UserDocumentOverrides = {}

type UserModelType = Model<IUser, {}, UserDocumentOverrides>


export const UserSchema: Schema = new Schema<IUser, UserModelType>({
  username: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dob: { type: Date, required: true },
  createdOn: { type: Date, required: true },
  version: { type: Number, required: true }
})

const UserModel: Model<IUser, {}, UserDocumentOverrides, {}> = model('User', UserSchema)

export default UserModel