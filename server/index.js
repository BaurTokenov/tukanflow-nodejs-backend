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
import { NODE_ENV, MONGO_URL, ACCESS_TOKEN } from './envVariables'

// ! CHANGE IT OFTEN
// let ACCESS_TOKEN =
//   'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImZpZVlleXpUcmxSdEY0d0J2Y0hVeHJaN2RnX3dPRXdGeVRIOXVEeGRJSTgiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85MmJiYzcwZi03MWQwLTRlYjMtOWI2ZS1lMjA5MWFiOTIwOWIvIiwiaWF0IjoxNjIxNzQyNDEyLCJuYmYiOjE2MjE3NDI0MTIsImV4cCI6MTYyMTc0NjMxMiwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVNRQTIvOFRBQUFBQjlCdHdLUlgwYk41cjFyOXJMdTgweDdBbFlqUnRVTWFCV25PaUdPTktzdz0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIChvZmZpY2lhbCBzaXRlKSIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJUYWxpcG92IiwiZ2l2ZW5fbmFtZSI6IkFudWFyIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiOC4zNy40My43IiwibmFtZSI6IkFudWFyIFRhbGlwb3YiLCJvaWQiOiJlMmJhYWM1NC1lNTcyLTRlNTUtYWYyMi0zZjY1M2I0YWY0ZmUiLCJwbGF0ZiI6IjUiLCJwdWlkIjoiMTAwMzIwMDE0NEUzMDE2OCIsInJoIjoiMC5BWEVBRDhlN2t0QnhzMDZiYnVJSkdya2dtN1hJaTk3NTJiRklxSzIzU05weVVHUnhBTTAuIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWQuU2hhcmVkIENhbGVuZGFycy5SZWFkV3JpdGUgQ2FsZW5kYXJzLlJlYWRXcml0ZS5TaGFyZWQgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIGVtYWlsIE1haWwuU2VuZCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6IjdiWmJoa0dYd2t0c1VpVjBTVWxuV29nRnFwdUdyQ1k5Z1VoUUlpc2ZaUVEiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiQVMiLCJ0aWQiOiI5MmJiYzcwZi03MWQwLTRlYjMtOWI2ZS1lMjA5MWFiOTIwOWIiLCJ1bmlxdWVfbmFtZSI6ImFudWFyQHR1a2FuZ2FtYml0Lm9ubWljcm9zb2Z0LmNvbSIsInVwbiI6ImFudWFyQHR1a2FuZ2FtYml0Lm9ubWljcm9zb2Z0LmNvbSIsInV0aSI6IjRtbXZVRFh6T1V1c2dUdVRlejgwQVEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiTS1hSWJ2VTVoTV9zRldYOWd5YmhhRnVKNDdwRTJaS0k1MjI2T1hTaUpTVSJ9LCJ4bXNfdGNkdCI6MTYyMTY5NTI0MH0.VdHtDqgoMQIfCLbNM4F_KiATNFPPx7NqlufNwevcLGq-XRIBmBMGmiRypD9hFKj1N23xbjhZ-Ba-IdPL4m9slLp42UOQH-_X3UdZscG1I6OUpPCVJxfJVVjityAu8k0GrVOQNz2a8O90sXwAYD5SUDBTBkXC9D6fZIg6yKjqOwPrGk7TOYRkXs1nVDWr56AdKQ1PXaz2gYMNXvW1QgMXzStty1Vzu6-U9ESk79bMPYRS2CqB_TE-Z8qrwFjHL-EWEK7KpbXTUirFbd7HrXmVjHdmYcu6B9rDQilwluZ-hJ48SPZT7mGnQjcFgO8v8EPDGIw3ffxPtkjsOrafexgXxg'
const GRAPH_URI = 'https://graph.microsoft.com/v1.0'

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
app.post('/findmeeting', async (req, res) => {
  let attendees = req.body
  console.log('body', req.body)
  console.log({
    attendees
  })
  attendees = attendees.map(x => ({
    emailAddress: {
      address: x
    }
  }))

  console.log({ ACCESS_TOKEN })
  const meeting_obj = {
    attendees: attendees,
    meetingDuration: 'PT1H'
  }
  //console.log(meeting_obj)
  const find_meeting_resp = await axios({
    url: `${GRAPH_URI}/me/findMeetingTimes`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    data: meeting_obj
  })
  let top_suggestions = find_meeting_resp.data['meetingTimeSuggestions'].slice(
    0,
    5
  )
  top_suggestions = top_suggestions.map(x => x['meetingTimeSlot'])
  res.send(top_suggestions)
})

app.post('/schedulemeeting', async (req, res) => {
  req.body['attendees'] = req.body['attendees'].map(x => ({
    emailAddress: { address: x }
  }))
  const data = req.body
  console.log(data)
  const _ = await axios({
    url: `${GRAPH_URI}/me/events`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    data: data
  }).catch(function(error) {
    console.log(error)
  })
  res.send('Meeting successfully arranged')
})

app.post('/invite', async (req, res) => {
  req.body['attendees'] = req.body['attendees'].map(x => ({
    emailAddress: { address: x }
  }))
  const start_time = new Date(req.body['start']['dateTime'])
  const end_time = new Date(req.body['end']['dateTime'])

  const message = {
    message: {
      subject: `Meeting Schedule: ${req.body['subject']}`,
      body: {
        contentType: 'Text',
        content: `
            The meeting schedule

            Start time: ${start_time.toDateString()} ${start_time.toTimeString()}
            End time: ${end_time.toDateString()} ${end_time.toTimeString()}
          `
      },
      toRecipients: req.body['attendees']
    }
  }
  const _ = await axios({
    url: `${GRAPH_URI}/me/sendMail`,
    method: 'post',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`
    },
    data: message
  }).catch(function(error) {
    console.log(error)
  })
  res.send('Invitation emails are sent out')
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
