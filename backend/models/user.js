const mongoose = require('mongoose')
const Meeting = require('./meeting')
const Recognition = require('./recognition')
const cloudinary = require('../utils/cloudinary')

const userSchema = new mongoose.Schema(
  {
    name: String,
    fullname: String,
    authId: String,
    email: String,
    picture: String,
    role: {
      type: String,
      enum: ['student', 'teacher', 'superadmin'],
      default: 'student',
    },
  },
  { timestamps: true }
)

userSchema.set('toJSON', {
  versionKey: false,
})

userSchema.pre('remove', async function () {
  const meetingIds = await Meeting.find({ createdBy: this._id }).distinct('_id')
  return Promise.all([
    Recognition.deleteMany({ meetingId: { $in: meetingIds } }),
    meetingIds.forEach(async (meetingId) => {
      await cloudinary.api.delete_resources_by_prefix(meetingId.toString())
    }),
    Meeting.deleteMany({ createdBy: this._id }),
  ])
})

module.exports = mongoose.model('User', userSchema)
