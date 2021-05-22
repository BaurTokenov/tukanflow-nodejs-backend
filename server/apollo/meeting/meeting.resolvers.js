module.exports = {
  Query: {
    async meetings(_, __, { models: { Meeting } }) {
      try {
        const meetings = await Meeting.find({})
        return meetings
      } catch (error) {
        throw error
      }
    },
    async meeting(_, { id }, { models: { Meeting } }) {
      try {
        const meeting = await Meeting.findById(id).exec()
        return meeting
      } catch (error) {
        throw error
      }
    }
  },
  Mutation: {
    async addMeeting(_, { input }, { models: { Meeting } }) {
      try {
        const meeting = await new Meeting(input)
        await meeting.save()
        return meeting
      } catch (error) {
        throw error
      }
    },
    async updateMeeting(_, { input, id }, { models: { Meeting } }) {
      try {
        const meeting = await Meeting.findOneAndUpdate({ _id: id }, input, {
          new: true
        }).exec()
        return meeting
      } catch (error) {
        throw error
      }
    },
    async deleteMeeting(_, { id }, { models: { Meeting } }) {
      try {
        const meeting = await Meeting.findByIdAndRemove(id).exec()
        return meeting ? meeting._id : null
      } catch (error) {
        throw error
      }
    }
  },
  Meeting: {
    id(meeting) {
      return `${meeting._id}`
    },
    async users(meeting, _, ctx) {
      if (!meeting.users) return []
      const users = await ctx.loaders.userLoader.loadMany(
        meeting.users.filter(user => user != null)
      )
      return users
    }
  }
}
