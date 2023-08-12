const mongoose = require('mongoose')

const recognitionSchema = new mongoose.Schema({
  neutral: Number,
  happy: Number,
  sad: Number,
  anger: Number,
  fear: Number,
  disgust: Number,
  surprise: Number,
  contempt: Number,
  predict: String,
  image: String,
  meetingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meeting',
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

recognitionSchema.set('toJSON', {
  versionKey: false,
})

module.exports = mongoose.model('Recognition', recognitionSchema)
