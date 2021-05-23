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
let ACCESS_TOKEN = "eyJ0eXAiOiJKV1QiLCJub25jZSI6InRtRGVCZ1RuT1hRLW1FX2xqa0M5WlgyNUNWOHlISXo2YVYyRWo2bXBoRDgiLCJhbGciOiJSUzI1NiIsIng1dCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyIsImtpZCI6Im5PbzNaRHJPRFhFSzFqS1doWHNsSFJfS1hFZyJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85MmJiYzcwZi03MWQwLTRlYjMtOWI2ZS1lMjA5MWFiOTIwOWIvIiwiaWF0IjoxNjIxNzQwMjA3LCJuYmYiOjE2MjE3NDAyMDcsImV4cCI6MTYyMTc0NDEwNywiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJ1cm46bWljcm9zb2Z0OnJlcTEiLCJ1cm46bWljcm9zb2Z0OnJlcTIiLCJ1cm46bWljcm9zb2Z0OnJlcTMiLCJjMSIsImMyIiwiYzMiLCJjNCIsImM1IiwiYzYiLCJjNyIsImM4IiwiYzkiLCJjMTAiLCJjMTEiLCJjMTIiLCJjMTMiLCJjMTQiLCJjMTUiLCJjMTYiLCJjMTciLCJjMTgiLCJjMTkiLCJjMjAiLCJjMjEiLCJjMjIiLCJjMjMiLCJjMjQiLCJjMjUiXSwiYWlvIjoiRTJaZ1lNZzllaVRyWExEUjdiempyVFl5Sm9HcW5uS3BzL2R4SDVHSW5SL1VzOFJncmpFQSIsImFtciI6WyJwd2QiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggZXhwbG9yZXIgKG9mZmljaWFsIHNpdGUpIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlRhbGlwb3YiLCJnaXZlbl9uYW1lIjoiQW51YXIiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiI4LjM3LjQzLjciLCJuYW1lIjoiQW51YXIgVGFsaXBvdiIsIm9pZCI6ImUyYmFhYzU0LWU1NzItNGU1NS1hZjIyLTNmNjUzYjRhZjRmZSIsInBsYXRmIjoiNSIsInB1aWQiOiIxMDAzMjAwMTQ0RTMwMTY4IiwicmgiOiIwLkFYRUFEOGU3a3RCeHMwNmJidUlKR3JrZ203WElpOTc1MmJGSXFLMjNTTnB5VUdSeEFNMC4iLCJzY3AiOiJDYWxlbmRhcnMuUmVhZCBDYWxlbmRhcnMuUmVhZC5TaGFyZWQgQ2FsZW5kYXJzLlJlYWRXcml0ZSBDYWxlbmRhcnMuUmVhZFdyaXRlLlNoYXJlZCBvcGVuaWQgcHJvZmlsZSBVc2VyLlJlYWQgZW1haWwiLCJzdWIiOiI3YlpiaGtHWHdrdHNVaVYwU1VsbldvZ0ZxcHVHckNZOWdVaFFJaXNmWlFRIiwidGVuYW50X3JlZ2lvbl9zY29wZSI6IkFTIiwidGlkIjoiOTJiYmM3MGYtNzFkMC00ZWIzLTliNmUtZTIwOTFhYjkyMDliIiwidW5pcXVlX25hbWUiOiJhbnVhckB0dWthbmdhbWJpdC5vbm1pY3Jvc29mdC5jb20iLCJ1cG4iOiJhbnVhckB0dWthbmdhbWJpdC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiItR0xsMDd4N1lrR1lqZXRLRGFRUUFRIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX3N0Ijp7InN1YiI6Ik0tYUlidlU1aE1fc0ZXWDlneWJoYUZ1SjQ3cEUyWktJNTIyNk9YU2lKU1UifSwieG1zX3RjZHQiOjE2MjE2OTUyNDB9.B6axD2_sFnsGPx6m30qNb3euM69qlv72dnSd7yGq6b27fIyvtAuwNrmOl3sFTKpzt9DC3U9EoSHMh3J53h4B0bmiiNBTtVQDYjXZwZaEwVLkWq00KFfYvX2umnyCFuEcId6BQMELOqOGrq6htvWmoG8GTOLo9BUR_wJervST2P0PdE1HmT-2sLdW1BMWHHy6cSNZWnHMKX4YwG3PljEPlHwFyn5aQ0nwMUCwt-q3tf_JWTQ8RUkdf-iQNYMmNOSVScs9UxqJVo-cD0KY5QhjG-hwwzwRFsNYCPU7jBjDXOh-EeqtdESv8nLmpsukU4gXXD8eiJpFVMeO521qEd_FZw"
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


app.post('/schedulemeeting', async (req, res) => {
  req.body["attendees"] = req.body["attendees"].map(
    x => ({ "emailAddress": { "address": x } })
  )
  const data = req.body
  console.log(data)
  const _ = await axios({
    url: `${GRAPH_URI}/me/events`,
    method: 'post',
    headers: {
      'Authorization': `Bearer ${ACCESS_TOKEN}`
    },
    data: data
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
