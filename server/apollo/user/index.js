import model from './user.model'
import gqlLoader from '../gqlLoader'
import resolvers from './user.resolvers'
import loader from './user.loader'

module.exports = {
  typeDefs: gqlLoader('./user/user.graphql'),
  model,
  resolvers,
  loader
}
