<template>
  <div class="mt-n13 pt-n13">
    <ChartRadar :is-popup="true" :data="data?.recognitionsOverview" />
    <ChartDoughnut :is-popup="true" :data="data?.recognitionsSummary" />
    <MiscValenceArousel :is-popup="true" :data="data?.valenceArousalSummary" />
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
