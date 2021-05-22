import { AuthenticationError } from 'apollo-server-express'

const authenticated = next => (root, args, ctx, info) => {
  if (!ctx.user) {
    throw new AuthenticationError('not authenticated')
  }
  return next(root, args, ctx, info)
}

module.exports = {
  authenticated
}
