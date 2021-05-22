import merge from 'lodash/merge'
import { GraphQLScalarType } from 'graphql'
import passport from 'passport'
import gqlLoader from './gqlLoader'

import user from './user'
import auth from './auth'
import meeting from './meeting'
require('./../passportHelper')(passport)

const resolverMap = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A date and time, represented as an ISO-8601 string',
    serialize: value => value.toISOString(),
    parseValue: value => new Date(value),
    parseLiteral: ast => new Date(ast.value)
  })
}

const serverConfig = {
  introspection: true,
  playground: true,
  tracing: true,
  typeDefs: [
    gqlLoader('./index.graphql'),
    user.typeDefs,
    auth.typeDefs,
    meeting.typeDefs
  ].join(' '),
  resolvers: merge(
    {},
    user.resolvers,
    auth.resolvers,
    meeting.resolvers,
    resolverMap
  ),
  context: ({ req, connection }) => {
    return {
      user: connection ? null : req.user,
      logout: connection ? function emptyFunction() {} : req.logout,
      models: {
        User: user.model,
        Meeting: meeting.model
      },
      loaders: {
        meetingLoader: meeting.loader,
        userLoader: user.loader
      }
    }
  }
}

module.exports = serverConfig
