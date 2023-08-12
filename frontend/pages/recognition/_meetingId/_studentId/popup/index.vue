<template>
  <div>
    <BaseHeader :text="individual?.user?.name" />
    <CardRecognitionPopup :data="data" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { io } from 'socket.io-client'

export default {
  name: 'RecognitionMeetingIdStudentIdPopupPage',
  middleware: 'auth',
  data() {
    return {
      isLoading: false,
      isSimpleMode: false,
      socketIo: '',
    }
  },
  head() {
    return {
      title: this.individual?.user?.name,
    }
  },
  computed: {
    ...mapGetters('recognition', ['individual']),
    data() {
      return this.individual?.meeting || {}
    },
    breadcrumbsItems() {
      return [
        {
          text: 'Recognition',
          disabled: false,
          exact: true,
          to: { name: 'recognition' },
        },
        {
          text: this.individual?.meeting?.code,
          disabled: false,
          exact: true,
          to: {
            name: 'recognition-meetingId',
            params: { code: this.$route.params.meetingId },
          },
        },
        {
          text: this.individual?.user?.name,
          disabled: true,
        },
      ]
    },
  },
  mounted() {
    this.fetchIndividualData()
  },
  beforeDestroy() {
    if (this.socketIo) this.socketIo.disconnect()
  },
  methods: {
    ...mapActions('recognition', ['fetchIndividual']),
    fetchIndividualData() {
      this.isLoading = true
      this.fetchIndividual({
        id: this.$route.params.meetingId,
        userId: this.$route.params.studentId,
        limit: this.isSimpleMode ? 15 : '',
      })
        .then(() => {
          this.individual?.meeting?.isStart &&
            !this.socketIo &&
            this.initSocketIo()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    simpleToggle() {
      this.isSimpleMode = !this.isSimpleMode
      this.fetchIndividualData()
    },
    initSocketIo() {
      this.socketIo = io(process.env.NUXT_ENV_RESTAPI_BASE_URL)
      this.socketIo.emit(
        'join',
        `${this.$route.params.meetingId}-${this.$route.params.studentId}`
      )
      this.socketIo.on('RECOGNITION_DATA_ADDED', () => {
        this.fetchIndividualData()
      })
    },
  },
}
</script>
