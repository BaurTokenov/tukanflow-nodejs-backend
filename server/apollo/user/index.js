import model from './user.model'
import gqlLoader from '../gqlLoader'
import resolvers from './user.resolvers'

module.exports = {
  typeDefs: gqlLoader('./user/user.graphql'),
  model,
  resolvers
}
