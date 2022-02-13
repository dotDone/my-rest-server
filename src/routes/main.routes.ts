import { Router, Request, Response } from 'express'
const mainRouter: Router = Router()

mainRouter.get('/', (req: Request, res: Response): void => {
  res.setHeader('Content-Type', 'text/html')
  res.send('<h1>Hello World!</h1>')
})

export default mainRouter