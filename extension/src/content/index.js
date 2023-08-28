import * as tf from '@tensorflow/tfjs'
import { io } from 'socket.io-client'
import axios from 'axios'

const modelUrl = 'https://raw.githubusercontent.com/farishuwaidi/mymodel_56tfjs/main/model.json'
// const modelUrl = 'https://raw.githubusercontent.com/farishuwaidi/mymodel_52tfjs/main/model.json'
const modelValenceArousalUrl =
  'https://raw.githubusercontent.com/farishuwaidi/model_valaro/main/model.json'
// const modelUrl =
//   'https://raw.githubusercontent.com/farishuwaidi/model_efficinetnetb2/main/model.json'
// const modelUrl = 'https://raw.githubusercontent.com/derrydwi/tfjs_model/main/model.json'
// const modelUrl = 'https://raw.githubusercontent.com/farishuwaidi/model_tfjs_exp/main/model.json'
// const modelUrl =
//   'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/SavedModels/sqftToPropertyPrice/model.json'
const baseUrl = 'https://api.emoview-faris.hcerpl.id'

let model,
  modelValenceArousal,
  video,
  canvas,
  canvas2,
  ctx,
  expressionText,
  valenceText,
  arousalText
let isBusy = false

const init = async () => {
  ;[model, modelValenceArousal] = await Promise.all([
    tf.loadLayersModel(modelUrl),
    tf.loadLayersModel(modelValenceArousalUrl),
  ])
  model.summary()
  modelValenceArousal.summary()
  const state = await chrome.storage.sync.get()
  await chrome.storage.sync.set({
    isStart: state.isStart ?? false,
    user: state.user || {},
  })
  chrome.storage.sync.get().then((result) => {
    console.log('FER:: Chrome storage', result)
  })

  initSocketIo()

  await Promise.all([
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      const div = document.createElement('div')
      video = document.createElement('video')
      canvas = document.createElement('canvas')
      ctx = canvas.getContext('2d')
      canvas2 = document.createElement('canvas')
      expressionText = document.createElement('div')
      valenceText = document.createElement('div')
      arousalText = document.createElement('div')
      div.style.position = 'relative'
      div.style.width = '1px'
      div.style.zIndex = 99
      canvas.style.position = canvas2.style.position = 'absolute'
      canvas.style.top = canvas.style.left = canvas2.style.top = canvas2.style.left = 0
      canvas.width = canvas.height = video.width = video.height = 180
      canvas.style.visibility = 'hidden'
      video.autoplay = true
      video.srcObject = stream
      expressionText.style.bottom = '1.5rem'
      valenceText.style.bottom = '0.3rem'
      arousalText.style.bottom = '-0.9rem'
      expressionText.style.position =
        valenceText.style.position =
        arousalText.style.position =
          'absolute'
      expressionText.style.width = valenceText.style.width = arousalText.style.width = '180px'
      expressionText.style.color = valenceText.style.color = arousalText.style.color = 'white'
      expressionText.style.fontSize =
        valenceText.style.fontSize =
        arousalText.style.fontSize =
          '16px'
      expressionText.style.textAlign =
        valenceText.style.textAlign =
        arousalText.style.textAlign =
          'center'
      expressionText.style.backgroundColor =
        valenceText.style.backgroundColor =
        arousalText.style.backgroundColor =
          '#989898'
      div.appendChild(expressionText)
      div.appendChild(valenceText)
      div.appendChild(arousalText)
      document.body.appendChild(div)
      div.appendChild(video)
      div.appendChild(canvas)
      div.appendChild(canvas2)
    }),
  ])
}

const initSocketIo = async () => {
  const socket = io(baseUrl)
  socket.emit('join', `student-${code}`)
  socket.on('SEND_RECOGNITION_DATA', ({ meetingId, datetime }) => {
    if (isBusy) return
    predict({ meetingId, datetime })
    console.log('FER:: Current time', datetime)
  })
}

const predict = async ({ meetingId, datetime }) => {
  const state = await chrome.storage.sync.get()
  if (state.isStart) {
    isBusy = true
    const tensor = tf.browser
      .fromPixels(video)
      .resizeNearestNeighbor([128, 128])
      .mean(2)
      .toFloat()
      .expandDims(0)
      .expandDims(-1)
    const tensorValenceArousal = tf.browser
      .fromPixels(video)
      .resizeNearestNeighbor([64, 64])
      .mean(2)
      .toFloat()
      .expandDims(0)
      .expandDims(-1)
    const result = await model.predict(tensor).arraySync()[0]
    const predictValenceArousal = await modelValenceArousal
      .predict(tensorValenceArousal)
      .arraySync()[0]
    const resultValenceArousal = scaleValue(predictValenceArousal)
    if (!result?.length) {
      console.log('FER:: Face not detected')
      isBusy = false
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const label = ['neutral', 'happiness', 'sadness', 'surprise', 'fear', 'disgust', 'anger']
      const labelValenceArousal = ['valence', 'arousal']
      const parsedResult = Object.fromEntries(label.map((name, index) => [name, result[index]]))
      const parsedResultValenceArousal = Object.fromEntries(
        labelValenceArousal.map((name, index) => [name, resultValenceArousal[index]]),
      )
      const probability = parseProbability(parsedResult)
      const probabilityValenceArousal = parseProbability(parsedResultValenceArousal)
      const predict = getExpression(parsedResult)
      expressionText.textContent = `${predict} (${probability[predict]})`
      valenceText.textContent = `valence (${probabilityValenceArousal.valence})`
      arousalText.textContent = `arousal (${probabilityValenceArousal.arousal})`
      console.log('FER::', { probability, probabilityValenceArousal, predict })
      const headers = {
        headers: {
          Authorization: state.user.token,
        },
      }
      const url = `${baseUrl}/recognition`
      const body = {
        ...probability,
        ...probabilityValenceArousal,
        predict,
        meetingId,
        image: canvas.toDataURL('image/jpeg'),
        createdAt: datetime,
        updatedAt: datetime,
      }
      axios
        .post(url, body, headers)
        .then(({ data }) => {
          console.log('FER:: Success', data)
        })
        .catch((err) => {
          console.log('FER:: Error', err)
        })
        .finally(() => {
          isBusy = false
        })
    }
  }
}

const getExpression = (expressions) => {
  const maxValue = Math.max(...Object.values(expressions))
  return Object.keys(expressions).find((expression) => expressions[expression] === maxValue)
}

const parseProbability = (probability) => {
  return Object.assign(
    ...Object.entries(probability).map((item) => ({
      [item[0]]: Number(item[1].toFixed(2)),
    })),
  )
}

const scaleValue = (array) => {
  const minValue = Math.min(...array)
  const maxValue = Math.max(...array)
  const maxAbsValue = Math.max(Math.abs(minValue), Math.abs(maxValue))
  const scaleFactor = maxAbsValue > 1 ? 1 / maxAbsValue : 1
  const scaledArray = array.map((value) => value * scaleFactor)
  return scaledArray
}

const code = location.pathname.includes('_')
  ? location.pathname.substring(7)
  : location.pathname.substring(1)

init()
