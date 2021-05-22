import model from './stage.model'
import gqlLoader from '../gqlLoader'
import resolvers from './stage.resolvers'
import loader from './stage.loader'

module.exports = {
  typeDefs: gqlLoader('./stage/stage.graphql'),
  model,
  resolvers,
  loader
}
