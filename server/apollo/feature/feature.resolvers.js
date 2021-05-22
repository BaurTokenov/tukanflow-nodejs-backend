module.exports = {
  Query: {
    async features(_, __, { models: { Feature } }) {
      try {
        const features = await Feature.find({})
        return features
      } catch (error) {
        throw error
      }
    },
    async feature(_, { id }, { models: { Feature } }) {
      try {
        const feature = await Feature.findById(id).exec()
        return feature
      } catch (error) {
        throw error
      }
    }
  },
  Mutation: {
    async addFeature(_, { input }, { models: { Feature } }) {
      try {
        const feature = await new Feature(input)
        await feature.save()
        return feature
      } catch (error) {
        throw error
      }
    },
    async updateFeature(_, { input, id }, { models: { Feature } }) {
      try {
        const feature = await Feature.findOneAndUpdate({ _id: id }, input, {
          new: true
        }).exec()
        return feature
      } catch (error) {
        throw error
      }
    },
    async deleteFeature(_, { id }, { models: { Feature } }) {
      try {
        const feature = await Feature.findByIdAndRemove(id).exec()
        return feature ? feature._id : null
      } catch (error) {
        throw error
      }
    }
  },
  Feature: {
    id(feature) {
      return `${feature._id}`
    }
  }
}
