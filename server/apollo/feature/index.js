import model from './feature.model'
import gqlLoader from '../gqlLoader'
import resolvers from './feature.resolvers'
import loader from './feature.loader'

module.exports = {
  typeDefs: gqlLoader('./feature/feature.graphql'),
  model,
  resolvers,
  loader
}
