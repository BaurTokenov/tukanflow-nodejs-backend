import DataLoader from 'dataloader'
import UserModel from './user.model'

async function batchFunction(userIds) {
  const users = await UserModel.find({ _id: { $in: userIds } })
  const results = userIds.map(userId => {
    const singleUser = users.find(
      user => user._id.toString() === userId.toString()
    )
    return singleUser
  })
  return results
}

const loader = new DataLoader(batchFunction)

export default loader
