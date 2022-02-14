import { Router } from "express"
import * as authController from '../controllers/auth.controller'

const authRouter: Router = Router()

authRouter.route('/').post(authController.login)

export default authRouter