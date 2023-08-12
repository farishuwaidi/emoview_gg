<template>
  <v-container>
    <Radar
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
  </v-container>
</template>

<script>
import { Radar } from 'vue-chartjs/legacy'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
} from 'chart.js'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
)

export default {
  name: 'ChartRadar',
  components: {
    Radar,
  },
  props: {
    chartId: {
      type: String,
      default: 'radar-chart',
    },
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    width: {
      type: Number,
      default: 350,
    },
    height: {
      type: Number,
      default: 350,
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
      default: false,
      type: Boolean,
    },
  },
  computed: {
    chartData() {
      return {
        labels: this.data?.labels,
        datasets: [
          {
            backgroundColor: 'rgba(25, 118, 210, 0.2)',
            borderColor: 'rgba(25, 118, 210, 1)',
            pointBackgroundColor: 'rgba(25, 118, 210, 1)',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgba(25, 118, 210, 1)',
            data: this.data?.datas,
          },
        ],
      }
    },
    chartOptions() {
      return {
        maintainAspectRatio: false,
        scales: {
          r: {
            pointLabels: {
              font: {
                size: this.radarFontSize,
              },
            },
            ticks: {
              display: false,
              stepSize: 25,
            },
          },
        },
        interaction: {
          mode: 'nearest',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label({ formattedValue }) {
                return `${formattedValue}%`
              },
            },
            displayColors: false,
          },
        },
      }
    },
    radarFontSize() {
      return this.isPopup ? 0 : 12
    },
  },
}
</script>
