const mongoose = require('mongoose')
const Recognition = require('../models/recognition')
const Meeting = require('../models/meeting')
const User = require('../models/user')
const cloudinary = require('../utils/cloudinary')
const io = require('../utils/socketio')

let recognitionInterval = {}

const get = async ({ id, limit }) => {
  const [
    meeting,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary,
    valenceArousalSummary,
  ] = await Promise.all([
    Meeting.findById(id).lean(),
    Recognition.aggregate([
      { $match: { meetingId: mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: { $toString: '$createdAt' },
          neutral: { $avg: '$neutral' },
          happiness: { $avg: '$happiness' },
          sadness: { $avg: '$sadness' },
          anger: { $avg: '$anger' },
          fear: { $avg: '$fear' },
          disgust: { $avg: '$disgust' },
          surprise: { $avg: '$surprise' },
          valence: { $avg: '$valence' },
          arousal: { $avg: '$arousal' },
        },
      },
      {
        $project: {
          neutral: { $round: ['$neutral', 2] },
          happiness: { $round: ['$happiness', 2] },
          sadness: { $round: ['$sadness', 2] },
          anger: { $round: ['$anger', 2] },
          fear: { $round: ['$fear', 2] },
          disgust: { $round: ['$disgust', 2] },
          surprise: { $round: ['$surprise', 2] },
          valence: { $round: ['$valence', 2] },
          arousal: { $round: ['$arousal', 2] },
        },
      },
      { $sort: { _id: -1 } },
      ...(limit ? [{ $limit: parseInt(limit, 10) }] : []),
      { $sort: { _id: 1 } },
    ]),
    Recognition.aggregate([
      {
        $match: { meetingId: mongoose.Types.ObjectId(id) },
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
    ]),
    Recognition.aggregate([
      {
        $match: { meetingId: mongoose.Types.ObjectId(id) },
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
        $match: { meetingId: mongoose.Types.ObjectId(id) },
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
      { $unset: ['_id'] },
    ]),
  ])
  const labelsOverview = [
    'Neutral',
    'Happiness',
    'Sadness',
    'Anger',
    'Fear',
    'Disgust',
    'Surprise',
  ]
  const labelsSummary = ['Positive', 'Negative']
  const labelsValenceArousal = ['Valence', 'Arousal']
  if (!meeting) return
  return {
    meeting: {
      ...meeting,
      recognitionsOverview: {
        labels: labelsOverview,
        datas: Object.values(recognitionsOverview[0]),
      },
      recognitionsSummary: {
        labels: labelsSummary,
        datas: Object.values(recognitionsSummary[0]),
      },
      recognitionsDetail: {
        labels: recognitionDetail.map(({ _id }) => _id),
        neutral: recognitionDetail.map(({ neutral }) => neutral),
        happiness: recognitionDetail.map(({ happiness }) => happiness),
        sadness: recognitionDetail.map(({ sadness }) => sadness),
        anger: recognitionDetail.map(({ anger }) => anger),
        fear: recognitionDetail.map(({ fear }) => fear),
        disgust: recognitionDetail.map(({ disgust }) => disgust),
        surprise: recognitionDetail.map(({ surprise }) => surprise),
        valence: recognitionDetail.map(({ valence }) => valence),
        arousal: recognitionDetail.map(({ arousal }) => arousal),
      },
      valenceArousalSummary: {
        labels: labelsValenceArousal,
        datas: Object.values(valenceArousalSummary[0]),
      },
    },
  }
}

const getById = async ({ id, userId, limit }) => {
  const [
    meeting,
    user,
    recognitionDetail,
    recognitionsOverview,
    recognitionsSummary,
    valenceArousalSummary,
  ] = await Promise.all([
    Meeting.findById(id).lean(),
    User.findById(userId).lean(),
    limit
      ? Recognition.aggregate([
          {
            $match: {
              meetingId: mongoose.Types.ObjectId(id),
              userId: mongoose.Types.ObjectId(userId),
            },
          },
          { $sort: { createdAt: -1 } },
          { $limit: parseInt(limit, 10) },
          { $sort: { createdAt: 1 } },
        ])
      : Recognition.find({
          meetingId: id,
          userId,
        }).select('-meeting -user'),
    Recognition.aggregate([
      {
        $match: {
          meetingId: mongoose.Types.ObjectId(id),
          userId: mongoose.Types.ObjectId(userId),
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
    ]),
    Recognition.aggregate([
      {
        $match: {
          meetingId: mongoose.Types.ObjectId(id),
          userId: mongoose.Types.ObjectId(userId),
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
          meetingId: mongoose.Types.ObjectId(id),
          userId: mongoose.Types.ObjectId(userId),
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
      { $unset: ['_id'] },
    ]),
  ])
  const labelsOverview = [
    'Neutral',
    'Happiness',
    'Sadness',
    'Anger',
    'Fear',
    'Disgust',
    'Surprise',
  ]
  const labelsSummary = ['Positive', 'Negative']
  const labelsValenceArousal = ['Valence', 'Arousal']
  if (!meeting || !user) return
  return {
    user,
    meeting: {
      ...meeting,
      recognitionsOverview: {
        labels: labelsOverview,
        datas: Object.values(recognitionsOverview[0]),
      },
      recognitionsSummary: {
        labels: labelsSummary,
        datas: Object.values(recognitionsSummary[0]),
      },
      recognitionsDetail: {
        labels: recognitionDetail.map(({ createdAt }) => createdAt),
        neutral: recognitionDetail.map(({ neutral }) => neutral),
        happiness: recognitionDetail.map(({ happiness }) => happiness),
        sadness: recognitionDetail.map(({ sadness }) => sadness),
        anger: recognitionDetail.map(({ anger }) => anger),
        fear: recognitionDetail.map(({ fear }) => fear),
        disgust: recognitionDetail.map(({ disgust }) => disgust),
        surprise: recognitionDetail.map(({ surprise }) => surprise),
        valence: recognitionDetail.map(({ valence }) => valence),
        arousal: recognitionDetail.map(({ arousal }) => arousal),
        image: recognitionDetail.map(({ image }) => image),
      },
      valenceArousalSummary: {
        labels: labelsValenceArousal,
        datas: Object.values(valenceArousalSummary[0]),
      },
    },
  }
}

const getOverview = async ({ role, createdBy }) => {
  const data = await Recognition.aggregate([
    {
      $match: {
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

const getSummary = async ({ role, createdBy }) => {
  const [recognitionsSummary, valenceArousalSummary] = await Promise.all([
    Recognition.aggregate([
      {
        $match: {
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
      { $unset: ['_id'] },
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

const create = async ({ userId, image, rest }) => {
  const { secure_url } = await cloudinary.uploader.upload(image, {
    folder: `${rest.meetingId}/${userId}`,
  })
  const recognition = new Recognition({
    ...rest,
    image: secure_url,
    userId,
  })
  const data = await recognition.save()
  if (!data) return
  const socket = io()
  socket
    .to([rest.meetingId, `${rest.meetingId}-${userId}`])
    .emit('RECOGNITION_DATA_ADDED')
  return data
}

const update = async ({ id, isStart, code }) => {
  const data = await Meeting.findByIdAndUpdate(
    id,
    {
      isStart,
      ...(isStart && { startedAt: new Date() }),
    },
    { new: true }
  )
  if (isStart) {
    recognitionInterval[code] = setInterval(() => {
      const socket = io()
      socket
        .to(`student-${code}`)
        .emit('SEND_RECOGNITION_DATA', { meetingId: id, datetime: new Date() })
    }, 5000)
  } else {
    clearInterval(recognitionInterval[code])
    delete recognitionInterval[code]
  }
  if (!data) return
  return data
}

const remove = async ({ id }) => {
  const data = await Recognition.findById(id)
  if (!data) return
  const public_id = data.image.substring(
    data.image.indexOf('.jpg') - 20,
    data.image.indexOf('.jpg')
  )
  await Promise.all([
    cloudinary.uploader.destroy(
      `${data.meetingId}/${data.userId}/${public_id}`
    ),
    data.remove(),
  ])
  return data
}

module.exports = {
  get,
  getById,
  getOverview,
  getSummary,
  create,
  update,
  remove,
}
