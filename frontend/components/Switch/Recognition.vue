<template>
  <v-switch
    v-model="isStart"
    inset
    readonly
    hide-details="true"
    class="my-5"
    @click="startRecognitionData"
  >
    <template #label>
      <span>Recognition</span>
      <div v-if="isStart" class="d-flex ms-auto">
        <div class="recording my-auto me-3" />
        <span class="my-auto">{{ elapsedTime }}</span>
      </div>
    </template>
  </v-switch>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SwitchRecognition',
  props: {
    getMeetingId: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      counting: '',
      elapsedTime: '',
    }
  },
  computed: {
    isStart() {
      return this.getMeetingId ? this.getMeetingId.isStart : ''
    },
  },
  watch: {
    isStart: {
      handler(value) {
        if (value && !this.counting) {
          this.setElapsedTime()
          this.counting = setInterval(() => {
            this.setElapsedTime()
          }, 1000)
        } else {
          clearInterval(this.counting)
          this.counting = ''
        }
      },
      immediate: true,
    },
  },
  beforeDestroy() {
    clearInterval(this.counting)
  },
  methods: {
    ...mapActions('recognition', ['startRecognition']),
    startRecognitionData() {
      this.startRecognition({
        id: this.getMeetingId?._id,
        data: {
          isStart: !this.getMeetingId?.isStart,
          code: this.getMeetingId?.code,
        },
      }).finally(() => {
        this.$emit('refetch')
      })
    },
    setElapsedTime() {
      this.elapsedTime = this.$dayjs
        .utc(
          this.$dayjs().diff(
            this.getMeetingId ? this.getMeetingId.startedAt : this.$dayjs()
          )
        )
        .format('HH:mm:ss')
    },
  },
}
</script>
