const state = () => ({
  students: [],
  studentDetail: {},
  studentOverview: {},
  studentSummary: {},
})

const getters = {
  students: (state) => {
    return state.students
  },
  studentDetail: (state) => {
    return state.studentDetail
  },
  studentOverview: (state) => {
    return state.studentOverview
  },
  studentSummary: (state) => {
    return state.studentSummary
  },
}

const mutations = {
  SET_STUDENTS(state, param) {
    state.students = param
  },
  SET_STUDENT_DETAIL(state, param) {
    state.studentDetail = param
  },
  SET_STUDENT_OVERVIEW(state, param) {
    state.studentOverview = param
  },
  SET_STUDENT_SUMMARY(state, param) {
    state.studentSummary = param
  },
}

const actions = {
  fetchStudents({ commit }, { meetingId }) {
    commit('SET_STUDENTS', [])
    return this.$axios
      .$get('/user', {
        params: { role: 'student', ...(meetingId && { meetingId }) },
      })
      .then(({ data }) => {
        commit('SET_STUDENTS', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch students', error.message)
      })
  },
  fetchStudentDetail({ commit }, { id }) {
    commit('SET_STUDENT_DETAIL', {})
    return this.$axios
      .$get(`/user/${id}`)
      .then(({ data }) => {
        commit('SET_STUDENT_DETAIL', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch student detail', error.message)
      })
  },
  fetchStudentOverview({ commit }, { id }) {
    commit('SET_STUDENT_OVERVIEW', {})
    return this.$axios
      .$get(`/user/${id}/overview`)
      .then(({ data }) => {
        commit('SET_STUDENT_OVERVIEW', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch student overview', error.message)
      })
  },
  fetchStudentSummary({ commit }, { id }) {
    commit('SET_STUDENT_SUMMARY', {})
    return this.$axios
      .$get(`/user/${id}/summary`)
      .then(({ data }) => {
        commit('SET_STUDENT_SUMMARY', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch student summary', error.message)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
