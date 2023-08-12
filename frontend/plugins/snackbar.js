export default ({ store }, inject) => {
  inject('snackbar', ({ content, color = 'success' }) => {
    store.commit('snackbar/SET_SNACKBAR', { content, color })
  })
}
