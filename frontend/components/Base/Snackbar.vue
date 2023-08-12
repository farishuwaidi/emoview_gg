<template>
  <v-snackbar v-model="show" :color="color" right class="pb-9">
    {{ message }}
    <template #action>
      <v-btn text @click="show = !show">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'BaseSnackbar',
  data() {
    return {
      show: false,
      message: '',
      color: '',
    }
  },
  mounted() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'snackbar/SET_SNACKBAR') {
        this.message = state.snackbar.content
        this.color = state.snackbar.color
        this.show = true
      }
    })
  },
}
</script>