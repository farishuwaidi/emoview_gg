<template>
  <div class="mt-n13 pt-n13">
    <ChartRadar :is-popup="true" :data="data?.recognitionsOverview" />
    <ChartDoughnut :is-popup="true" :data="data?.recognitionsSummary" />
  </div>
</template>

<script>
export default {
  name: 'CardRecognitionPopup',
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
}
</script>
