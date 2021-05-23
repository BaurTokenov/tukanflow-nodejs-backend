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
let ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJub25jZSI6Ik1GSkpaeUpsZnhWdk9HRXBqVHlwcGk1cmJnNVVBazQ0RmttS2RVT3lNM3MiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85MmJiYzcwZi03MWQwLTRlYjMtOWI2ZS1lMjA5MWFiOTIwOWIvIiwiaWF0IjoxNjIxNzM2NTkyLCJuYmYiOjE2MjE3MzY1OTIsImV4cCI6MTYyMTc0MDQ5MiwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiQVNRQTIvOFRBQUFBT2RoRnhNRWdiUmVIYWJ1T3I1Q1puZVFVNzl6SlhBalNHdERmc0ZGUkhqQT0iLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIGV4cGxvcmVyIChvZmZpY2lhbCBzaXRlKSIsImFwcGlkIjoiZGU4YmM4YjUtZDlmOS00OGIxLWE4YWQtYjc0OGRhNzI1MDY0IiwiYXBwaWRhY3IiOiIwIiwiZmFtaWx5X25hbWUiOiJUYWxpcG92IiwiZ2l2ZW5fbmFtZSI6IkFudWFyIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiOC4zNy40My43IiwibmFtZSI6IkFudWFyIFRhbGlwb3YiLCJvaWQiOiJlMmJhYWM1NC1lNTcyLTRlNTUtYWYyMi0zZjY1M2I0YWY0ZmUiLCJwbGF0ZiI6IjUiLCJwdWlkIjoiMTAwMzIwMDE0NEUzMDE2OCIsInJoIjoiMC5BWEVBRDhlN2t0QnhzMDZiYnVJSkdya2dtN1hJaTk3NTJiRklxSzIzU05weVVHUnhBTTAuIiwic2NwIjoiQ2FsZW5kYXJzLlJlYWQgQ2FsZW5kYXJzLlJlYWQuU2hhcmVkIENhbGVuZGFycy5SZWFkV3JpdGUgQ2FsZW5kYXJzLlJlYWRXcml0ZS5TaGFyZWQgb3BlbmlkIHByb2ZpbGUgVXNlci5SZWFkIGVtYWlsIiwic3ViIjoiN2JaYmhrR1h3a3RzVWlWMFNVbG5Xb2dGcXB1R3JDWTlnVWhRSWlzZlpRUSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6IjkyYmJjNzBmLTcxZDAtNGViMy05YjZlLWUyMDkxYWI5MjA5YiIsInVuaXF1ZV9uYW1lIjoiYW51YXJAdHVrYW5nYW1iaXQub25taWNyb3NvZnQuY29tIiwidXBuIjoiYW51YXJAdHVrYW5nYW1iaXQub25taWNyb3NvZnQuY29tIiwidXRpIjoicTh3WEtwS25zRUc2NjJURmJ1RzVBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19zdCI6eyJzdWIiOiJNLWFJYnZVNWhNX3NGV1g5Z3liaGFGdUo0N3BFMlpLSTUyMjZPWFNpSlNVIn0sInhtc190Y2R0IjoxNjIxNjk1MjQwfQ.FoolE7ox7JvhIV2-aL-sWLQ1LnbFhdCJtj8lw9sLq52x00MphwXzJYUlyUcIU1jp3uhBmJlHu6_e2jt1rhBrQ-zX-1niGRyIS2TAj6CZXPwjwE6pfqU10A5rZIkYSMJhSxBJP_zKcwyYsNdvMu-RQcE80qDhWWMtglQiyYdbz6IMEeOqCrbBvCFUIK2EBe5YKiH-twEHPTln7XrRcGeheEALVGfju8z99JL-Djq3nnYpfhdtMWt0lwlNdD1MsmjxZ-NX0k6KbgwnhzkmV8RrYZT__HiUA7sFSQPy9RxKnrPmxtvIS3qxKmW8pXjxH-HNm_cqhl0ipLlitqQHfgh4hw"
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
app.post('/findmeeting', async (req, res) => {
  let attendees = req.body;
  attendees = attendees.map(x => ({
    "emailAddress": {
      "address": x
    }
  }))
  const meeting_obj = {
    "attendees": attendees,
    "meetingDuration": "PT1H"
  }
  //console.log(meeting_obj)
  const find_meeting_resp = await axios({
    url: `${GRAPH_URI}/me/findMeetingTimes`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    data: meeting_obj
  })
  let top_suggestions = find_meeting_resp.data["meetingTimeSuggestions"].slice(0, 5)
  top_suggestions = top_suggestions.map(x => x["meetingTimeSlot"])
  res.send(top_suggestions)
})

/*
app.post('/schedulemeeting', async (req, res) => {
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
*/
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
