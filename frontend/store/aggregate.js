const state = () => ({
  meeting: '',
  student: '',
  teacher: '',
})

const getters = {
  meeting: (state) => {
    return state.meeting
  },
  student: (state) => {
    return state.student
  },
  teacher: (state) => {
    return state.teacher
  },
}

const mutations = {
  SET_MEETING(state, param) {
    state.meeting = param
  },
  SET_STUDENT(state, param) {
    state.student = param
  },
  SET_TEACHER(state, param) {
    state.teacher = param
  },
}

const actions = {
  fetchMeeting({ commit }) {
    commit('SET_MEETING', '')
    return this.$axios
      .$get('/meeting/count')
      .then(({ data }) => {
        commit('SET_MEETING', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch aggregate meeting', error.message)
      })
  },
  fetchStudent({ commit }) {
    commit('SET_STUDENT', {})
    return this.$axios
      .$get('/user/count', { params: { role: 'student' } })
      .then(({ data }) => {
        commit('SET_STUDENT', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch aggregate student', error.message)
      })
  },
  fetchTeacher({ commit }) {
    commit('SET_TEACHER', {})
    return this.$axios
      .$get('/user/count', { params: { role: 'teacher' } })
      .then(({ data }) => {
        commit('SET_TEACHER', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch aggregate teacher', error.message)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
