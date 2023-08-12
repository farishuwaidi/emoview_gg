const state = () => ({
  content: '',
  color: '',
})

const mutations = {
  SET_SNACKBAR(state, param) {
    state.content = param.content
    state.color = param.color
  },
}

export default {
  state,
  mutations,
}
