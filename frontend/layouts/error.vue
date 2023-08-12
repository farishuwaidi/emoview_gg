<template>
  <div class="text-center">
    <div v-if="error.statusCode === 404">
      <v-icon large class="mt-n3 me-3">mdi-alert</v-icon
      ><span class="text-h5 text--primary">{{ pageNotFound }}</span>
      <p class="mt-6">The page you were looking for does not exist.</p>
    </div>
    <div v-else class="text-h5 mb-6">{{ otherError }}</div>
    <v-btn
      text
      outlined
      color="primary"
      @click="$router.push({ name: 'index' })"
    >
      Go to Home Page
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred',
    }
  },
  head() {
    return {
      title:
        this.error.statusCode === 404 ? this.pageNotFound : this.otherError,
    }
  },
}
</script>
