<template>
  <div class="text-center">
    <v-img src="/get-started.svg" max-width="450" class="mx-auto mb-2" />
    <p>Let's get started by adding a room and enjoy the emotion recognition</p>
    <v-btn
      color="primary"
      class="text-capitalize"
      aria-label="Add Room"
      depressed
      :to="{ name: 'recognition' }"
      ><v-icon class="me-2">mdi-rocket</v-icon>Get Started</v-btn
    >
  </div>
</template>

<script>
export default {
  name: 'MiscGetStarted',
}
</script>
