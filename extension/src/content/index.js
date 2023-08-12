import * as tf from '@tensorflow/tfjs'

const modelUrl = 'https://raw.githubusercontent.com/derrydwi/tfjs_model/main/model.json'
const baseUrl = 'https://api.emoview-faris.hcerpl.id'

let video, canvas, canvas2, expressionText
let model

const init = async () => {
  model = await tf.loadLayersModel(modelUrl)
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
      canvas2 = document.createElement('canvas')
      expressionText = document.createElement('div')
      div.style.position = 'relative'
      div.style.width = '1px'
      div.style.zIndex = 99
      canvas.style.position = canvas2.style.position = 'absolute'
      canvas.style.top = canvas.style.left = canvas2.style.top = canvas2.style.left = 0
      canvas.width = canvas.height = video.width = video.height = 180
      canvas.style.visibility = 'hidden'
      video.autoplay = true
      video.srcObject = stream
      expressionText.style.position = 'absolute'
      expressionText.style.bottom = '1.48rem'
      expressionText.style.width = '180px'
      expressionText.style.color = 'white'
      expressionText.style.fontSize = '16px'
      expressionText.style.textAlign = 'center'
      expressionText.style.backgroundColor = '#989898'
      div.appendChild(expressionText)
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
      .resizeNearestNeighbor([48, 48])
      .mean(2)
      .toFloat()
      .expandDims(0)
      .expandDims(-1)
    const result = await model.predict(tensor).arraySync()[0]
    if (!result?.length) {
      console.log('FER:: Face not detected')
      isBusy = false
    } else {
      const label = ['neutral', 'happy', 'sad', 'surprise', 'fear', 'disgust', 'anger', 'contempt']
      const parsedResult = Object.fromEntries(label.map((name, index) => [name, result[index]]))
      const probability = parseProbability(parsedResult)
      const predicted = getExpression(parsedResult)
      expressionText.textContent = `${predicted} (${probability[predicted]})`
      console.log('FER::', { probability, predicted })
      const headers = {
        headers: {
          Authorization: state.user.token,
        },
      }
      const url = `${baseUrl}/recognition`
      const body = {
        ...parseProbability(faceApiResult[0].expressions),
        predict: getExpression(faceApiResult[0].expressions),
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

const code = location.pathname.includes('_')
  ? location.pathname.substring(7)
  : location.pathname.substring(1)

init()
