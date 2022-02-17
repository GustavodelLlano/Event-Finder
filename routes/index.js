module.exports = app => {

  /* GET home page */
  const indexRouter = require("./index.routes")
  app.use("/", indexRouter)

  // User routes
  const userRouter = require("./user.routes")
  app.use("/", userRouter)

  // Event routes
  const eventRouter = require("./events.routes")
  app.use("/", eventRouter)

  // Auth routes
  const authRouter = require("./auth.routes")
  app.use("/", authRouter)

  // Map routes
  const apiRouter = require('./api.routes')
  app.use('/', apiRouter)
}