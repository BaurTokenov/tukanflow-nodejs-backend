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
import axios from 'axios'

// import corsOptions from './corsOptions'
import apollo from './apollo'
import fetchUrlRoutes from './fetchUrlRoutes'
import { NODE_ENV, MONGO_URL } from './envVariables'

// ! CHANGE IT OFTEN
let ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJub25jZSI6IkxQaE9IaGtKY2oxQnpjNUpaUVRQUDEzWHlYSmpDQm5uRUw5TFJjSHlJV1EiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85MmJiYzcwZi03MWQwLTRlYjMtOWI2ZS1lMjA5MWFiOTIwOWIvIiwiaWF0IjoxNjIxNzExMDc1LCJuYmYiOjE2MjE3MTEwNzUsImV4cCI6MTYyMTcxNDk3NSwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVNRQTIvOFRBQUFBT2VUWmFxaGorWnRaSzZxSlQyQnQ2SWVReUxHNVJieEgxcVptT1dXNFd4VT0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIChvZmZpY2lhbCBzaXRlKSIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJUYWxpcG92IiwiZ2l2ZW5fbmFtZSI6IkFudWFyIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiOC4zOC4xNzIuNDUiLCJuYW1lIjoiQW51YXIgVGFsaXBvdiIsIm9pZCI6ImUyYmFhYzU0LWU1NzItNGU1NS1hZjIyLTNmNjUzYjRhZjRmZSIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzMjAwMTQ0RTMwMTY4IiwicmgiOiIwLkFYRUFEOGU3a3RCeHMwNmJidUlKR3JrZ203WElpOTc1MmJGSXFLMjNTTnB5VUdSeEFNMC4iLCJzY3AiOiJDYWxlbmRhcnMuUmVhZCBDYWxlbmRhcnMuUmVhZC5TaGFyZWQgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDYWxlbmRhcnMuUmVhZFdyaXRlLlNoYXJlZCBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgZW1haWwiLCJzdWIiOiI3YlpiaGtHWHdrdHNVaVYwU1VsbldvZ0ZxcHVHckNZOWdVaFFJaXNmWlFRIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiOTJiYmM3MGYtNzFkMC00ZWIzLTliNmUtZTIwOTFhYjkyMDliIiwidW5pcXVlX25hbWUiOiJhbnVhckB0dWthbmdhbWJpdC5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJhbnVhckB0dWthbmdhbWJpdC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiJnZWFBUjA4dDBFZW1YQTZQZEVuaEFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6Ik0tYUlidlU1aE1fc0ZXWDlneWJoYUZ1SjQ3cEUyWktJNTIyNk9YU2lKU1UifSwieG1zX3RjZHQiOjE2MjE2OTUyNDB9.Ox4BEoZWVjCzdn5_bAU4JqB9hGY2sgQ8kiiv4DEed10c5Q2KrjEzjxy8570NAb6vU5tNWg_DSpYQ0VLFLVwlOavLx16tHcFcT0aKFUBKuv7A_E7P8pH_FzDffeOiAcUFl7f2vcOLelOUyk1xiSsCtiYcRjcyiJwRPHYn-L-wCKGUqOf4JQK5o12tP7zbDyXhNA8T3teAca-zb7RtMMNeiYtSMCMtO2u3QLxQooehL29cQrjSeV1SeCJBHam2hujRXQCEPOeTcAlV7g9l3JbbfgmaC1wGdMBbKZtJIMVDc5aSAdkU_sSpWdwAd9FkCKZiV2b1pyj6ddx6tgfGAUeaiQ"
let GRAPH_URI = "https://graph.microsoft.com/v1.0"

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


// Email and calendar management

// Schedule a meeting
app.post('/meeting', async (req, res) => {
  const attendees = req.body;
  const find_meeting_resp = await axios({
    url: `${GRAPH_URI}/me/findMeetingTimes`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    data: JSON.stringify(attendees)
  })

  // Extract data
  const meeting_suggestion = find_meeting_resp.data["meetingTimeSuggestions"][0]
  //console.log(meeting_suggestion)
  const start_time_obj = meeting_suggestion["meetingTimeSlot"]["start"]
  const end_time_obj = meeting_suggestion["meetingTimeSlot"]["end"]
  // Assume both start and end timezones are the same
  const subject = "Meeting for something"
  const _ = await axios({
    url: `${GRAPH_URI}/me/events`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    data: {
      "subject": subject,
      "start": start_time_obj,
      "end": end_time_obj
    }
  }).catch(function (error) { console.log(error) })
  res.send('Meeting successfully arranged')
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
