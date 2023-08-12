const state = () => ({
  profile: {},
})

const getters = {
  profile: (state) => {
    return state.profile
  },
}

const mutations = {
  SET_PROFILE(state, param) {
    state.profile = param
  },
}

const actions = {
  fetchProfile({ commit }) {
    commit('SET_PROFILE', {})
    return this.$axios
      .$get('/profile')
      .then(({ data }) => {
        commit('SET_PROFILE', data)
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log('Error fetch profile', error.message)
      })
  },
  editName(_, { data }) {
    return this.$axios
      .$put('/user', data)
      .then(() => {
        this.$snackbar({ content: 'Name updated' })
      })
      .catch(() => {
        this.$snackbar({ content: "Can't update name", color: 'error' })
      })
  },
}

export default {
  state,
  getters,
  mutations,
  actions,
}
