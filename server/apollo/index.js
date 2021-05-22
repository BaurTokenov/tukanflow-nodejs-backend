import serverConfig from './serverConfig'

const { ApolloServer } = require('apollo-server-express')
const http = require('http')

module.exports = app => {
  const server = new ApolloServer(serverConfig)
  server.applyMiddleware({
    app
  })
  const httpServer = http.createServer(app)
  server.installSubscriptionHandlers(httpServer)
  return { httpServer, server }
}
