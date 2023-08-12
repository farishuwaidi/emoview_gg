const state = () => ({
  meetings: [],
  meetingDetail: {},
})

const getters = {
  meetings: (state) => {
    return state.meetings
  },
  meetingDetail: (state) => {
    return state.meetingDetail
  },
}

const mutations = {
  SET_MEETINGS(state, param) {
    state.meetings = param
  },
  SET_MEETING_DETAIL(state, param) {
    state.meetingDetail = param
  },
}

const actions = {
  fetchMeetings({ commit }) {
    commit('SET_MEETINGS', [])
    return this.$axios
      .$get('/meeting')
      .then(({ data }) => {
        commit('SET_MEETINGS', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch meetings', error.message)
      })
  },
  fetchMeetingDetail({ commit }, { id }) {
    commit('SET_MEETING_DETAIL', {})
    return this.$axios
      .$get(`/meeting/${id}`)
      .then(({ data }) => {
        commit('SET_MEETING_DETAIL', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch meeting detail', error.message)
      })
  },
  addMeeting(_, { data }) {
    return this.$axios
      .$post('/meeting', data)
      .then(() => {
        this.$snackbar({ content: 'Room created' })
      })
      .catch(() => {
        this.$snackbar({ content: "Can't create room", color: 'error' })
      })
  },
  editMeeting(_, { id, data }) {
    return this.$axios
      .$put(`/meeting/${id}`, data)
      .then(() => {
        this.$snackbar({ content: 'Room updated' })
      })
      .catch(() => {
        this.$snackbar({ content: "Can't update room", color: 'error' })
      })
  },
  deleteMeeting(_, { id }) {
    return this.$axios
      .$delete(`/meeting/${id}`)
      .then(() => {
        this.$snackbar({ content: 'Room deleted' })
      })
      .catch(() => {
        this.$snackbar({ content: "Can't delete room", color: 'error' })
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
