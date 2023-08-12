const state = () => ({
  teachers: [],
  teacherDetail: {},
})

const getters = {
  teachers: (state) => {
    return state.teachers
  },
  teacherDetail: (state) => {
    return state.teacherDetail
  },
}

const mutations = {
  SET_TEACHERS(state, param) {
    state.teachers = param
  },
  SET_TEACHER_DETAIL(state, param) {
    state.teacherDetail = param
  },
}

const actions = {
  fetchTeachers({ commit }, { meetingId }) {
    commit('SET_TEACHERS', [])
    return this.$axios
      .$get('/user', {
        params: { role: 'teacher', ...(meetingId && { meetingId }) },
      })
      .then(({ data }) => {
        commit('SET_TEACHERS', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch teachers', error.message)
      })
  },
  fetchTeacherDetail({ commit }, { id }) {
    commit('SET_TEACHER_DETAIL', {})
    return this.$axios
      .$get(`/user/${id}`)
      .then(({ data }) => {
        commit('SET_TEACHER_DETAIL', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch teacher detail', error.message)
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
