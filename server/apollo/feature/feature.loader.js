import DataLoader from 'dataloader'
import FeatureModel from './feature.model'

async function batchFunction(featureIds) {
  const features = await FeatureModel.find({ _id: { $in: featureIds } })
  const results = featureIds.map(featureId => {
    const singlefeature = features.find(
      feature => feature._id.toString() === featureId.toString()
    )
    return singlefeature
  })
  return results
}

const loader = new DataLoader(batchFunction)

export default loader
