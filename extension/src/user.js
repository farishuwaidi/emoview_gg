import axios from 'axios'

const state = () => ({
  user: {},
  isStart: false,
})

const getters = {
  user: (state) => {
    return state.user
  },
  username: (state) => {
    return state.user.name
  },
  isStart: (state) => {
    return state.isStart
  },
}

const mutations = {
  SET_USER(state, param) {
    state.user = param
  },
  SET_IS_START(state, param) {
    state.isStart = param
  },
}

const actions = {
  fetchUser({ commit }, param) {
    return axios
      .get('https://api.emoview-faris.hcerpl.id/profile', {
        headers: {
          Authorization: `Bearer ${param}`,
        },
      })
      .then(({ data }) => {
        const user = {
          ...data.data,
          token: `Bearer ${param}`,
        }
        commit('SET_USER', user)
        chrome.storage.sync.set({ user }).then(() => {
          chrome.storage.sync.get().then((result) => {
            console.log(result)
          })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
  toggleIsStart({ state, commit }) {
    const isStart = !state.isStart
    commit('SET_IS_START', isStart)
    chrome.storage.sync.set({ isStart }).then(() => {
      chrome.storage.sync.get().then((result) => {
        console.log(result)
      })
    })
  },
  updateName({ commit, state }, { name }) {
    return axios
      .put(
        'https://api.emoview-faris.hcerpl.id/user',
        { name },
        { headers: { Authorization: state.user.token } },
      )
      .then(({ data }) => {
        const user = {
          ...state.user,
          ...data.data,
        }
        commit('SET_USER', user)
        chrome.storage.sync.set({ user }).then(() => {
          chrome.storage.sync.get().then((result) => {
            console.log(result)
          })
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
