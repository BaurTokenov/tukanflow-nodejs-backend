import gqlLoader from '../gqlLoader'
import resolvers from './auth.resolvers'

module.exports = {
  typeDefs: gqlLoader('./auth/auth.graphql'),
  resolvers
}
