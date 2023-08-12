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
  ] = await Promise.all([
    Meeting.findById(id).lean(),
    Recognition.aggregate([
      { $match: { meetingId: mongoose.Types.ObjectId(id) } },
      {
        $group: {
          _id: { $toString: '$createdAt' },
          neutral: { $avg: '$neutral' },
          happy: { $avg: '$happy' },
          sad: { $avg: '$sad' },
          anger: { $avg: '$anger' },
          fear: { $avg: '$fear' },
          disgust: { $avg: '$disgust' },
          surprise: { $avg: '$surprise' },
          contempt: { $avg: '$contempt' },
        },
      },
      {
        $project: {
          neutral: { $round: ['$neutral', 2] },
          happy: { $round: ['$happy', 2] },
          sad: { $round: ['$sad', 2] },
          anger: { $round: ['$anger', 2] },
          fear: { $round: ['$fear', 2] },
          disgust: { $round: ['$disgust', 2] },
          surprise: { $round: ['$surprise', 2] },
          contempt: { $round: ['$contempt', 2] },
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
          happy: { $avg: '$happy' },
          sad: { $avg: '$sad' },
          anger: { $avg: '$anger' },
          fear: { $avg: '$fear' },
          disgust: { $avg: '$disgust' },
          surprise: { $avg: '$surprise' },
          contempt: { $avg: '$contempt' },
        },
      },
      {
        $project: {
          neutral: { $round: { $multiply: ['$neutral', 100] } },
          happy: { $round: { $multiply: ['$happy', 100] } },
          sad: { $round: { $multiply: ['$sad', 100] } },
          anger: { $round: { $multiply: ['$anger', 100] } },
          fear: { $round: { $multiply: ['$fear', 100] } },
          disgust: { $round: { $multiply: ['$disgust', 100] } },
          surprise: { $round: { $multiply: ['$surprise', 100] } },
          contempt: { $round: { $multiply: ['$contempt', 100] } },
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
          positive: { $sum: { $add: ['$happy', '$surprise'] } },
          negative: {
            $sum: {
              $add: ['$sad', '$anger', '$fear', '$disgust', '$contempt'],
            },
          },
          count: {
            $sum: {
              $add: [
                '$happy',
                '$sad',
                '$anger',
                '$fear',
                '$disgust',
                '$surprise',
                '$contempt',
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
  ])
  const labelsOverview = [
    'Neutral',
    'Happy',
    'Sad',
    'Anger',
    'Fear',
    'Disgust',
    'Surprise',
    'Contempt',
  ]
  const labelsSummary = ['Positive', 'Negative']
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
        happy: recognitionDetail.map(({ happy }) => happy),
        sad: recognitionDetail.map(({ sad }) => sad),
        anger: recognitionDetail.map(({ anger }) => anger),
        fear: recognitionDetail.map(({ fear }) => fear),
        disgust: recognitionDetail.map(({ disgust }) => disgust),
        surprise: recognitionDetail.map(({ surprise }) => surprise),
        contempt: recognitionDetail.map(({ contempt }) => contempt),
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
          happy: { $avg: '$happy' },
          sad: { $avg: '$sad' },
          anger: { $avg: '$anger' },
          fear: { $avg: '$fear' },
          disgust: { $avg: '$disgust' },
          surprise: { $avg: '$surprise' },
          contempt: { $avg: '$contempt' },
        },
      },
      {
        $project: {
          neutral: { $round: { $multiply: ['$neutral', 100] } },
          happy: { $round: { $multiply: ['$happy', 100] } },
          sad: { $round: { $multiply: ['$sad', 100] } },
          anger: { $round: { $multiply: ['$anger', 100] } },
          fear: { $round: { $multiply: ['$fear', 100] } },
          disgust: { $round: { $multiply: ['$disgust', 100] } },
          surprise: { $round: { $multiply: ['$surprise', 100] } },
          contempt: { $round: { $multiply: ['$contempt', 100] } },
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
          positive: { $sum: { $add: ['$happy', '$surprise'] } },
          negative: {
            $sum: {
              $add: ['$sad', '$anger', '$fear', '$disgust', '$contempt'],
            },
          },
          count: {
            $sum: {
              $add: [
                '$happy',
                '$sad',
                '$anger',
                '$fear',
                '$disgust',
                '$surprise',
                '$contempt',
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
  ])
  const labelsOverview = [
    'Neutral',
    'Happy',
    'Sad',
    'Anger',
    'Fear',
    'Disgust',
    'Surprise',
    'Contempt',
  ]
  const labelsSummary = ['Positive', 'Negative']
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
        happy: recognitionDetail.map(({ happy }) => happy),
        sad: recognitionDetail.map(({ sad }) => sad),
        anger: recognitionDetail.map(({ anger }) => anger),
        fear: recognitionDetail.map(({ fear }) => fear),
        disgust: recognitionDetail.map(({ disgust }) => disgust),
        surprise: recognitionDetail.map(({ surprise }) => surprise),
        contempt: recognitionDetail.map(({ contempt }) => contempt),
        image: recognitionDetail.map(({ image }) => image),
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
        happy: { $avg: '$happy' },
        sad: { $avg: '$sad' },
        anger: { $avg: '$anger' },
        fear: { $avg: '$fear' },
        disgust: { $avg: '$disgust' },
        surprise: { $avg: '$surprise' },
        contempt: { $avg: '$contempt' },
      },
    },
    {
      $project: {
        neutral: { $round: { $multiply: ['$neutral', 100] } },
        happy: { $round: { $multiply: ['$happy', 100] } },
        sad: { $round: { $multiply: ['$sad', 100] } },
        anger: { $round: { $multiply: ['$anger', 100] } },
        fear: { $round: { $multiply: ['$fear', 100] } },
        disgust: { $round: { $multiply: ['$disgust', 100] } },
        surprise: { $round: { $multiply: ['$surprise', 100] } },
        contempt: { $round: { $multiply: ['$contempt', 100] } },
      },
    },
    { $unset: ['_id'] },
  ])
  const labels = [
    'Neutral',
    'Happy',
    'Sad',
    'Anger',
    'Fear',
    'Disgust',
    'Surprise',
    'Contempt',
  ]
  return data[0] ? { labels, datas: Object.values(data[0]) } : {}
}

const getSummary = async ({ role, createdBy }) => {
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
        positive: { $sum: { $add: ['$happy', '$surprise'] } },
        negative: {
          $sum: { $add: ['$sad', '$anger', '$fear', '$disgust', '$contempt'] },
        },
        count: {
          $sum: {
            $add: [
              '$happy',
              '$sad',
              '$anger',
              '$fear',
              '$disgust',
              '$surprise',
              '$contempt',
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
  ])
  const labels = ['Positive', 'Negative']
  return data[0] ? { labels, datas: Object.values(data[0]) } : {}
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
