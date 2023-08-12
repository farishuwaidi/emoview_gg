<template>
  <v-row class="fill-height" justify="center" align="center">
    <v-progress-circular
      :size="25"
      color="accent"
      class="me-4"
      indeterminate
    ></v-progress-circular>
    <p class="text-h6 text-center font-weight-regular mb-0">Signing in...</p>
  </v-row>
</template>

<script>
export default {
  name: 'MiscSigningIn',
}
</script>
