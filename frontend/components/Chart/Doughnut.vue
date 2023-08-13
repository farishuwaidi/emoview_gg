<template>
  <v-container>
    <Doughnut
      ref="doughnut"
      class="mx-auto mt-4"
      :chart-options="chartOptions"
      :chart-data="chartData"
      :chart-id="chartId"
      :dataset-id-key="datasetIdKey"
      :plugins="plugins"
      :css-classes="cssClasses"
      :styles="styles"
      :width="width"
      :height="height"
    />
    <span :class="isPopup ? 'customEmojiMargin' : 'emoji'">{{ emoji }}</span>
  </v-container>
</template>

<script>
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js'
import datalabels from 'chartjs-plugin-datalabels'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, datalabels)

ChartJS.defaults.plugins.datalabels.display = false

export default {
  name: 'ChartDoughnut',
  components: { Doughnut },
  props: {
    chartId: {
      type: String,
      default: 'doughnut-chart',
    },
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
    data: {
      type: Object,
      default: () => {},
    },
    isPopup: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    emoji() {
      if (!this.data?.datas.length) return ''
      else if (this.data?.datas.includes(NaN || null)) return '😐'
      else if (this.data?.datas[0] > this.data?.datas[1]) return '🙂'
      else return '🙁'
    },
    chartData() {
      return {
        labels: this.data?.labels,
        datasets: [
          {
            data: this.data?.datas,
            backgroundColor: [
              'rgba(84, 214, 51, 0.85)',
              'rgba(214, 51, 51, 0.85)',
            ],
          },
        ],
      }
    },
    chartOptions() {
      return {
        maintainAspectRatio: false,
        aspectRatio: 1,
        plugins: {
          datalabels: {
            display: true,
            formatter: (value) => (value ? `${value}%` : ''),
            color: '#fff',
          },
          tooltip: {
            enabled: false,
          },
        },
      }
    },
  },
}
</script>

<style scoped>
.emoji {
  font-size: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 100%);
}
.customEmojiMargin {
  font-size: 3rem;
  position: absolute;
  top: 64%;
  left: 50%;
  transform: translate(-50%, 100%);
}
</style>