<template>
  <p class="text-h5 my-4">{{ text }}</p>
</template>

<script>
export default {
  name: 'BaseHeader',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
}
</script>
