import DataLoader from 'dataloader'
import StageModel from './stage.model'

async function batchFunction(stageIds) {
  const stages = await StageModel.find({ _id: { $in: stageIds } })
  const results = stageIds.map(stageId => {
    const singlestage = stages.find(
      stage => stage._id.toString() === stageId.toString()
    )
    return singlestage
  })
  return results
}

const loader = new DataLoader(batchFunction)

export default loader
