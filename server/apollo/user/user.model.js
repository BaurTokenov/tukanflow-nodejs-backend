const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

const { Schema } = mongoose
const passportLocalMongoose = require('passport-local-mongoose')

const UserSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    role: String
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

UserSchema.plugin(passportLocalMongoose, {
  usernameQueryFields: ['email']
})

UserSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', UserSchema)
module.exports = User
