import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import path from 'path'
import secure from 'express-force-https'
import cors from 'cors'
import expressValidator from 'express-validator'
import passport from 'passport'
import bodyParser from 'body-parser'

// import corsOptions from './corsOptions'
import apollo from './apollo'
import fetchUrlRoutes from './fetchUrlRoutes'
import { NODE_ENV, MONGO_URL } from './envVariables'

const app = express()
const MongoStore = connectMongo(session)
const mongoUrl = MONGO_URL
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(
  session({
    secret: 'sdfkjasklfdhakjlsfhksad',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { secure: false }
  })
)
app.use(secure)

// authorization
require('./passportHelper')(passport)

app.use(passport.initialize())
app.use(passport.session())

app.use('/graphql', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function addUser(err, user) {
    if (user) {
      req.user = user
    }
    if (err) {
      return next(err)
    }
    return next()
  })(req, res, next)
})

const { httpServer, server } = apollo(app)
fetchUrlRoutes(app)

const PORT = process.env.PORT || 6001

httpServer.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  )
  // eslint-disable-next-line no-console
})

export default app
