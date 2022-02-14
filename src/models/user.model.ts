import { Model, model, Schema } from "mongoose"
import { IUser } from "../interfaces/user.interface"

type UserDocumentOverrides = {}

type UserModelType = Model<IUser, {}, UserDocumentOverrides>


export const UserSchema: Schema = new Schema<IUser, UserModelType>({
  username: { type: String, required: [true, 'Username required'], unique: true },
  firstName: { type: String, required: [true, 'First name required'] },
  lastName: { type: String, required: [true, 'Last name required'] },
  email: { type: String, required: [true, 'Email address required'], unique: true },
  password: { type: String, required: [true, 'Password required'] },
  dob: { type: Date, required: [true, 'Date of birth required'] },
  version: { type: Number, required: [true, 'Version number required'] },
  rooms: { type: [Schema.Types.ObjectId], required: false }
}, { timestamps: true, })

const UserModel: Model<IUser, {}, UserDocumentOverrides, {}> = model('User', UserSchema)

export default UserModel