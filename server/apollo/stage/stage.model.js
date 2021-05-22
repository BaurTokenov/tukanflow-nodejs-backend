const mongoose = require('mongoose')

const { Schema } = mongoose

const StageSchema = new Schema(
  {
    name: String,
    thumbnail: String,
    title: String,
    progress: Number,
    text: String,
    approvals: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        status: {
          type: String,
          enum: ['accepted', 'awaiting', 'rejected'],
          default: 'awaiting'
        }
      }
    ],
    goals: [
      {
        text: String,
        status: {
          type: String,
          enum: ['done', 'notDone'],
          default: 'notDone'
        },
        author: { type: Schema.Types.ObjectId, ref: 'User' }
      }
    ],
    summary: String,
    nextStage: { type: Schema.Types.ObjectId, ref: 'Stage' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Stage = mongoose.model('Stage', StageSchema)
module.exports = Stage
