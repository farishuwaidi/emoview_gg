<template>
  <div>
    <v-img src="/no-data.svg" max-width="450" class="mx-auto" />
    <p class="text-center">No {{ context }} available</p>
  </div>
</template>

<script>
export default {
  name: 'MiscNoData',
  props: {
    context: {
      type: String,
      default: '',
    },
  },
}
</script>
