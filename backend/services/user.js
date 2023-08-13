const mongoose = require('mongoose')
const Meeting = require('../models/meeting')
const User = require('../models/user')
const Recognition = require('../models/recognition')

const get = async ({ role, meetingId, createdBy, userRole }) => {
  return await User.find({
    ...(meetingId && {
      _id: {
        $in: await Recognition.find({ meetingId }).distinct('userId'),
      },
    }),
    ...(!meetingId &&
      role &&
      role !== 'teacher' && {
        _id: {
          $in: await Recognition.find({
            meetingId: {
              $in: await Meeting.find({
                ...(!userRole.includes('superadmin') && { createdBy }),
              }).distinct('_id'),
            },
          }).distinct('userId'),
        },
      }),
    ...(role && { role }),
  }).sort({ createdAt: 'desc' })
}

const getById = async ({ id }) => {
  return await User.findById(id)
}

const getCount = async ({ userRole, createdBy, role }) => {
  return await User.count({
    ...(role !== 'teacher' && {
      _id: {
        $in: await Recognition.find({
          meetingId: {
            $in: await Meeting.find({
              ...(!userRole.includes('superadmin') && { createdBy }),
            }).distinct('_id'),
          },
        }).distinct('userId'),
      },
    }),
    ...(role && { role }),
  })
}

const getOverview = async ({ id, role, createdBy }) => {
  const data = await Recognition.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(id),
        meetingId: {
          $in: await Meeting.find({
            ...(!role.includes('superadmin') && { createdBy }),
          }).distinct('_id'),
        },
      },
    },
    {
      $group: {
        _id: null,
        neutral: { $avg: '$neutral' },
        happiness: { $avg: '$happiness' },
        sadness: { $avg: '$sadness' },
        anger: { $avg: '$anger' },
        fear: { $avg: '$fear' },
        disgust: { $avg: '$disgust' },
        surprise: { $avg: '$surprise' },
      },
    },
    {
      $project: {
        neutral: { $round: { $multiply: ['$neutral', 100] } },
        happiness: { $round: { $multiply: ['$happiness', 100] } },
        sadness: { $round: { $multiply: ['$sadness', 100] } },
        anger: { $round: { $multiply: ['$anger', 100] } },
        fear: { $round: { $multiply: ['$fear', 100] } },
        disgust: { $round: { $multiply: ['$disgust', 100] } },
        surprise: { $round: { $multiply: ['$surprise', 100] } },
      },
    },
    { $unset: ['_id'] },
  ])
  const labels = [
    'Neutral',
    'Happiness',
    'Sadness',
    'Anger',
    'Fear',
    'Disgust',
    'Surprise',
  ]
  return data[0] ? { labels, datas: Object.values(data[0]) } : {}
}

const getSummary = async ({ id, role, createdBy }) => {
  const [recognitionsSummary, valenceArousalSummary] = await Promise.all([
    Recognition.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(id),
          meetingId: {
            $in: await Meeting.find({
              ...(!role.includes('superadmin') && { createdBy }),
            }).distinct('_id'),
          },
        },
      },
      {
        $group: {
          _id: null,
          positive: { $sum: { $add: ['$happiness', '$surprise'] } },
          negative: {
            $sum: {
              $add: ['$sadness', '$anger', '$fear', '$disgust'],
            },
          },
          count: {
            $sum: {
              $add: [
                '$happiness',
                '$sadness',
                '$anger',
                '$fear',
                '$disgust',
                '$surprise',
              ],
            },
          },
        },
      },
      {
        $project: {
          positive: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$positive', '$count'] }, 100],
                },
              },
            ],
          },
          negative: {
            $cond: [
              { $eq: ['$count', 0] },
              0,
              {
                $round: {
                  $multiply: [{ $divide: ['$negative', '$count'] }, 100],
                },
              },
            ],
          },
        },
      },
      { $unset: ['_id', 'count'] },
    ]),
    Recognition.aggregate([
      {
        $match: {
          userId: mongoose.Types.ObjectId(id),
          meetingId: {
            $in: await Meeting.find({
              ...(!role.includes('superadmin') && { createdBy }),
            }).distinct('_id'),
          },
        },
      },
      {
        $group: {
          _id: null,
          valence: { $avg: '$valence' },
          arousal: { $avg: '$arousal' },
        },
      },
      {
        $project: {
          valence: { $round: ['$valence', 2] },
          arousal: { $round: ['$arousal', 2] },
        },
      },
      { $unset: ['_id', 'count'] },
    ]),
  ])
  const labelsSummary = ['Positive', 'Negative']
  const labelsValenceArousal = ['Valence', 'Arousal']
  if (!recognitionsSummary.length) return
  return {
    recognitionsSummary: {
      labels: labelsSummary,
      datas: Object.values(recognitionsSummary[0]),
    },
    valenceArousalSummary: {
      labels: labelsValenceArousal,
      datas: Object.values(valenceArousalSummary[0]),
    },
  }
}

const create = async ({ body }) => {
  const { email } = body
  const user = await User.findOne({ email })
  if (user) return user
  const data = await User.findOneAndUpdate({ email }, body, {
    upsert: true,
    new: true,
  })
  if (!data) return
  return data
}

const update = async ({ userId, body }) => {
  const data = await User.findByIdAndUpdate(userId, body, {
    upsert: true,
    new: true,
  })
  if (!data) return
  return data
}

const remove = async ({ id }) => {
  const data = await User.findById(id)
  if (!data) return
  return await data.remove()
}

module.exports = {
  get,
  getById,
  getCount,
  getOverview,
  getSummary,
  create,
  update,
  remove,
}
