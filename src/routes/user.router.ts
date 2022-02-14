import { Router } from 'express'
import * as userController from '../controllers/user.controller'
import { RoutesController } from '../controllers/routes.controller'

const userRouter: Router = Router()

userRouter.route('/').get(userController.getUsers).post(userController.createUser).put(userController.editUser).delete(userController.deleteUser)
userRouter.route('/me').get(RoutesController.protect, userController.getMe)


export default userRouter
