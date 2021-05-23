import { ApolloError } from 'apollo-server-express'
import { includes } from 'lodash'
import { authenticated } from '../auth/auth.helper'

module.exports = {
  Query: {
    users: async (_, args, ctx) => {
      const users = await ctx.models.User.find({})
      return users
    },
    async user(_, args, ctx) {
      const item = await ctx.models.User.findById(args.id).exec()
      if (!item) {
        throw new Error('User does not exist')
      }
      return item
    }
  },
  Mutation: {
    async addUser(_, { input }, ctx) {
      try {
        const { User } = ctx.models
        const { password } = input
        delete input.password
        const user = await User.register(new User(input), password)

        return user
      } catch (err) {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            // duplicate username or email
            throw new ApolloError('User already exists')
          }
          throw new ApolloError(err)
        }
      }
      return null
    },
    updateUser: async (_, { id, input }, ctx) => {
      try {
        const { password } = input
        delete input.password
        const user = await ctx.models.User.findOneAndUpdate(
          { _id: id },
          input,
          {
            new: true
          }
        ).exec()
        if (password) {
          const sanitizedUser = await user.setPassword(password)
          await sanitizedUser.save()
        }
        return user
      } catch (err) {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            // duplicate username or email
            throw new ApolloError('User already exists')
          }

          // Some other error
          throw new ApolloError(err)
        }
      }
    },
    deleteUser: async (_, { id }, ctx) => {
      try {
        const result = await ctx.models.User.deleteOne({ _id: id })

        if (result.deletedCount !== 1) {
          throw new Error('Activity not deleted')
        }
        return id
      } catch (err) {
        throw new ApolloError(err)
      }
    }
  },
  User: {
    id(user) {
      return `${user._id}`
    }
  }
}
