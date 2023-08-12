<template>
  <v-card class="my-6" :height="height ? height : ''" outlined>
    <v-card-title class="font-weight-regular">{{ title }}</v-card-title>
    <v-card-text class="text--primary">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CardWrapper',
  props: {
    title: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 0,
    },
  },
}
</script>
