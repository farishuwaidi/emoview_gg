<template>
  <table>
    <tr v-for="(value, key) in valenceArousal" :key="key">
      <td>{{ key }}</td>
      <td>:</td>
      <td>{{ value }}</td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'ValenceArousel',
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    valenceArousal() {
      const { labels, datas } = this.data
      return Object.fromEntries(
        labels.map((label, index) => [label, datas[index]])
      )
    },
  },
}
</script>
