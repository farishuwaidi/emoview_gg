<template>
  <v-container>
    <v-img v-if="isShowImage" :src="thumbnailImage" width="180" class="mx-auto">
      <template #placeholder>
        <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
      </template>
    </v-img>
    <div class="d-flex align-center justify-space-between">
      <div class="d-flex">
        <v-switch
          v-model="isSimpleModeToggle"
          label="Simple Mode"
          hide-details="true"
          class="ms-7 me-2 my-0"
          inset
          readonly
          @click="$emit('simple-toggle')"
        >
        </v-switch>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-icon v-bind="attrs" small class="mt-1" v-on="on"
              >mdi-information-outline</v-icon
            >
          </template>
          <span
            >Only show the last 15 data of realtime emotion recognition</span
          >
        </v-tooltip>
      </div>
      <div>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="openPopup"
              ><v-icon>mdi-open-in-app</v-icon></v-btn
            >
          </template>
          <span>Open popup</span>
        </v-tooltip>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="exportData"
              ><v-icon>mdi-file-export</v-icon></v-btn
            >
          </template>
          <span>Export to csv</span>
        </v-tooltip>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              @click="$refs.bar.chart.resetZoom()"
              ><v-icon>mdi-magnify-minus-outline</v-icon></v-btn
            >
          </template>
          <span>Reset Zoom</span>
        </v-tooltip>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on" @click="$emit('refresh')"
              ><v-icon>mdi-refresh</v-icon></v-btn
            >
          </template>
          <span>Refresh</span>
        </v-tooltip>
      </div>
    </div>
    <LineChartJS
      ref="bar"
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
import { Line as LineChartJS } from 'vue-chartjs'
import zoomPlugin from 'chartjs-plugin-zoom'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js'
import exportFromJSON from 'export-from-json'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  zoomPlugin
)

export default {
  name: 'ChartLine',
  components: { LineChartJS },
  props: {
    chartId: {
      type: String,
      default: 'line-chart',
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
    name: {
      type: String,
      default: '',
    },
    meeting: {
      type: String,
      default: '',
    },
    isShowImage: {
      type: Boolean,
      default: false,
    },
    isSimpleMode: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentIndex: 0,
    }
  },
  computed: {
    isSimpleModeToggle: {
      get() {
        return this.isSimpleMode
      },
      set() {},
    },
    chartData() {
      return {
        labels: this.data?.labels,
        datasets: [
          {
            label: 'Happy',
            data: this.data?.happy,
            backgroundColor: 'transparent',
            borderColor: '#64DD17',
            borderWidth: 1,
            tension: 0.3,
          },
          {
            label: 'Surprise',
            data: this.data?.surprise,
            backgroundColor: 'transparent',
            borderColor: '#FF6D00',
            borderWidth: 1,
            tension: 0.3,
          },
          {
            label: 'Fear',
            data: this.data?.fear,
            backgroundColor: 'transparent',
            borderColor: '#AA00FF',
            borderWidth: 1,
            tension: 0.3,
          },
          {
            label: 'Contempt',
            data: this.data?.contempt,
            backgroundColor: 'transparent',
            borderColor: '#AA00FF',
            borderWidth: 1,
            tension: 0.3,
          },
          {
            label: 'Anger',
            data: this.data?.anger,
            backgroundColor: 'transparent',
            borderColor: '#D50000',
            borderWidth: 1,
            tension: 0.3,
          },
          {
            label: 'Disgust',
            data: this.data?.disgust,
            backgroundColor: 'transparent',
            borderColor: '#212121',
            borderWidth: 1,
            tension: 0.3,
          },
          {
            label: 'Sad',
            data: this.data?.sad,
            backgroundColor: 'transparent',
            borderColor: '#2962FF',
            borderWidth: 1,
            tension: 0.3,
          },
          {
            label: 'Neutral',
            data: this.data?.neutral,
            backgroundColor: 'transparent',
            borderColor: '#00B8D4',
            borderWidth: 1,
            tension: 0.3,
          },
        ],
      }
    },
    chartOptions() {
      return {
        maintainAspectRatio: false,
        aspectRatio: 1,
        elements: {
          point: {
            borderWidth: 0,
            radius: 0,
            backgroundColor: 'rgba(0,0,0,0)',
          },
        },
        plugins: {
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              threshold: 5,
              rangeMax: {
                x: null,
              },
            },
            zoom: {
              wheel: {
                enabled: !this.isSimpleMode,
                // enabled: true,
              },
              pinch: {
                enabled: !this.isSimpleMode,
                // enabled: true,
              },
              mode: 'x',
            },
          },
          tooltip: {
            itemSort(a, b) {
              return b.raw - a.raw
            },
            callbacks: {
              title: (context) => {
                this.currentIndex = context[0].dataIndex
                return new Date(context[0].label).toLocaleString('en-GB')
              },
            },
          },
          legend: {
            position: 'top',
            align: 'center',
          },
        },
        scales: {
          XAxis: {
            ticks: {
              autoSkip: true,
              callback(value) {
                return `${new Date(
                  this.getLabelForValue(value)
                ).toLocaleTimeString('en-GB')}`
              },
              // maxTicksLimit: 20,
              // maxTicksLimit: Math.round(
              //   this.parsedData?.labels?.length / 3
              // ),
            },
            grid: {
              display: false,
            },
            title: {
              display: true,
              text: 'Timestamp',
              font: {
                size: 13,
              },
            },
            // max: 5,
          },
          yAxis: {
            ticks: {
              stepSize: 0.2,
            },
            title: {
              display: true,
              text: 'Probability',
              font: {
                size: 13,
              },
            },
          },
        },
        interaction: {
          mode: 'index',
          intersect: false,
        },
        // stacked: false,
      }
    },
    thumbnailImage() {
      return this.data?.image[this.currentIndex] || ''
    },
  },
  watch: {
    'data.labels.length'(value) {
      this.currentIndex = value - 1
    },
  },
  methods: {
    exportData() {
      const { __typename, ...rest } = this.data
      const labels = [
        'Timestamp',
        'Neutral',
        'Happy',
        'Sad',
        'Angry',
        'Fearful',
        'Disgusted',
        'Surprised',
        'Image',
      ]
      const transpose = (array) =>
        array[0].map((_, index) => array.map((row) => row[index]))
      const data = [labels, ...transpose(Object.values(rest))]
      const fileName = `${this.name} - ${
        this.meeting
      } - ${new Date().toLocaleString()}`
      const exportType = exportFromJSON.types.csv
      exportFromJSON({ data, fileName, exportType })
    },
    openPopup() {
      window.open(
        `${this.$route.fullPath}/popup`,
        '_blank',
        'width=300,height=650'
      )
    },
  },
}
</script>
