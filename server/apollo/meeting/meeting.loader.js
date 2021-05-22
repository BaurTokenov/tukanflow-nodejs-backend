import DataLoader from 'dataloader'
import MeetingModel from './meeting.model'

async function batchFunction(meetingIds) {
  const meetings = await MeetingModel.find({ _id: { $in: meetingIds } })
  const results = meetingIds.map(meetingId => {
    const singlemeeting = meetings.find(
      meeting => meeting._id.toString() === meetingId.toString()
    )
    return singlemeeting
  })
  return results
}

const loader = new DataLoader(batchFunction)

export default loader
