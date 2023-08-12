const state = () => ({
  group: {},
  individual: {},
  overview: {},
  summary: {},
})

const getters = {
  group: (state) => {
    return state.group
  },
  individual: (state) => {
    return state.individual
  },
  overview: (state) => {
    return state.overview
  },
  summary: (state) => {
    return state.summary
  },
}

const mutations = {
  SET_GROUP(state, param) {
    state.group = param
  },
  SET_INDIVIDUAL(state, param) {
    state.individual = param
  },
  SET_OVERVIEW(state, param) {
    state.overview = param
  },
  SET_SUMMARY(state, param) {
    state.summary = param
  },
}

const actions = {
  fetchGroup({ commit }, { id, limit, isFirstFetch = true }) {
    isFirstFetch && commit('SET_GROUP', {})
    return this.$axios
      .$get(`/recognition/${id}`, {
        params: {
          ...(limit && { limit }),
        },
      })
      .then(({ data }) => {
        commit('SET_GROUP', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch group recognition', error.message)
      })
  },
  fetchIndividual({ commit }, { id, userId, limit, isFirstFetch = true }) {
    isFirstFetch && commit('SET_INDIVIDUAL', {})
    return this.$axios
      .$get(`/recognition/${id}/${userId}`, {
        params: {
          ...(limit && { limit }),
        },
      })
      .then(({ data }) => {
        commit('SET_INDIVIDUAL', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch individual recognition', error.message)
      })
  },
  startRecognition(_, { id, data }) {
    return this.$axios.$put(`/recognition/${id}`, data)
  },
  fetchOverview({ commit }) {
    commit('SET_OVERVIEW', {})
    return this.$axios
      .$get('/recognition/overview')
      .then(({ data }) => {
        commit('SET_OVERVIEW', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch overview', error.message)
      })
  },
  fetchSummary({ commit }) {
    commit('SET_SUMMARY', {})
    return this.$axios
      .$get('/recognition/summary')
      .then(({ data }) => {
        commit('SET_SUMMARY', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch summary', error.message)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
