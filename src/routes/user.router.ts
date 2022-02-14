import { Router } from 'express'
import * as userController from '../controllers/user.controller'

const userRouter: Router = Router()

userRouter.route('/').get(userController.getUsers).post(userController.createUser).put(userController.editUser).delete(userController.deleteUser)


export default userRouter
