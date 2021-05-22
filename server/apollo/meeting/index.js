import model from './meeting.model'
import gqlLoader from '../gqlLoader'
import resolvers from './meeting.resolvers'
import loader from './meeting.loader'

module.exports = {
  typeDefs: gqlLoader('./meeting/meeting.graphql'),
  model,
  resolvers,
  loader
}
