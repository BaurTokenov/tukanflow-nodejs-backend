const mongoose = require('mongoose')

const { Schema } = mongoose

const MeetingSchema = new Schema(
  {
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    start: {
      dateTime: Date,
      timeZone: String
    },
    end: {
      dateTime: Date,
      timeZone: String
    },
    subject: String
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Meeting = mongoose.model('Meeting', MeetingSchema)
module.exports = Meeting
