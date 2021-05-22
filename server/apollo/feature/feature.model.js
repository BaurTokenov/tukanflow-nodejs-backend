const mongoose = require('mongoose')

const { Schema } = mongoose

const FeatureSchema = new Schema(
  {
    name: String,
    stages: [{ type: Schema.Types.ObjectId, ref: 'Stage' }]
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

const Feature = mongoose.model('Feature', FeatureSchema)
module.exports = Feature
