import jwt from 'jsonwebtoken'
import { ApolloError } from 'apollo-server-express'
import { PASSPORT_KEY } from '../../envVariables'

module.exports = {
  Query: {
    getCurrentUser(_, __, ctx) {
      const { user } = ctx
      if (!user) {
        throw new Error('user is not authenticated')
      }
      return ctx.loaders.userLoader.load(user._id)
    }
  },
  Mutation: {
    async loginUser(_, { input }, ctx) {
      const { username, password } = input
      const { user, error } = await ctx.models.User.authenticate()(
        username,
        password
      )
      if (!user) throw new Error(error)
      const token = jwt.sign(
        { role: user.role, id: user._id, username: user.username },
        PASSPORT_KEY
      )
      return { token }
    },
    async register(_, { input }, ctx) {
      try {
        const { User } = ctx.models
        const { password } = input

        delete input.password

        const user = await User.register(new User({ ...input }), password)
        const userId = user._id
        return { message: 'registration successful', status: 'ok' }
      } catch (err) {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            // duplicate username or email
            throw new ApolloError('User already exists')
          }
          throw new ApolloError(err)
        }
      }
    },
    logout(_, __, ctx) {
      try {
        ctx.logout()
        return { message: 'logout successful', status: 'ok' }
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
