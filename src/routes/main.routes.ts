import express from 'express'
import server from "../server"

const app = server.app

app.get('/', (req: express.Request, res: express.Response) => {
  res.setHeader('Content-Type', 'text/html')
  res.send('<h1>Hello World!</h1>')
})