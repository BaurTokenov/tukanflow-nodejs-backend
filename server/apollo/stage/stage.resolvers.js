module.exports = {
  Query: {
    async stages(_, __, { models: { Stage } }) {
      try {
        const stages = await Stage.find({})
        return stages
      } catch (error) {
        throw error
      }
    },
    async stage(_, { id }, { models: { Stage } }) {
      try {
        const stage = await Stage.findById(id, 'id').exec()
        return stage
      } catch (error) {
        throw error
      }
    }
  },
  Mutation: {
    async addStage(_, { input }, { models: { Stage } }) {
      try {
        const stage = await new Stage(input)
        await stage.save()
        return stage
      } catch (error) {
        throw error
      }
    },
    async updateStage(_, { input, id }, { models: { Stage } }) {
      try {
        const stage = await Stage.findOneAndUpdate({ _id: id }, input, {
          new: true
        }).exec()
        return stage
      } catch (error) {
        throw error
      }
    },
    async deleteStage(_, { id }, { models: { Stage } }) {
      try {
        const stage = await Stage.findByIdAndRemove(id).exec()
        return stage ? stage._id : null
      } catch (error) {
        throw error
      }
    }
  },
  Stage: {
    id(stage) {
      return `${stage._id}`
    },
    async approvals(stage, _, ctx) {
      const { approvals } = stage
      if (!approvals) {
        return []
      }
      const newApprovals = await Promise.all(
        approvals.map(async approval => {
          const userId = approval.user
          if (userId) {
            const user = await ctx.loaders.userLoader.load(userId)

            return {
              ...approval.toObject(),
              user
            }
          }
          return approval
        })
      )
      return newApprovals
    },
    async goals(stage, _, ctx) {
      const { goals } = stage
      if (!goals) {
        return []
      }
      const newGoals = await Promise.all(
        goals.map(async goal => {
          const authorId = goal.author
          if (authorId) {
            const author = await ctx.loaders.userLoader.load(authorId)
            return {
              ...goal.toObject(),
              author
            }
          }
          return goal
        })
      )
      return newGoals
    },
    async nextStage(stage, _, ctx) {
      const nextStageId = stage.nextStage
      if (nextStageId) {
        const nextStage = await ctx.loaders.stageLoader.load(nextStageId)
        return nextStage
      }
      return null
    }
  }
}
