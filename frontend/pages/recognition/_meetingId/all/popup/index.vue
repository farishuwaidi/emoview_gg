<template>
  <div>
    <BaseHeader text="All" />
    <CardRecognitionPopup :data="group?.meeting" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { io } from 'socket.io-client'

export default {
  name: 'RecognitionMeetingIdAllPage',
  middleware: 'auth',
  data() {
    return {
      isLoading: false,
      isSimpleMode: false,
      socketIo: '',
    }
  },
  head: {
    title: 'All',
  },
  computed: {
    ...mapGetters('recognition', ['group']),
    breadcrumbsItems() {
      return [
        {
          text: 'Recognition',
          disabled: false,
          exact: true,
          to: { name: 'recognition' },
        },
        {
          text: this.group?.meeting?.code,
          disabled: false,
          exact: true,
          to: {
            name: 'recognition-meetingId',
            params: { code: this.$route.params.meetingId },
          },
        },
        {
          text: 'All',
          disabled: true,
        },
      ]
    },
  },
  mounted() {
    this.fetchGroupData()
  },
  beforeDestroy() {
    if (this.socketIo) this.socketIo.disconnect()
  },
  methods: {
    ...mapActions('recognition', ['fetchGroup']),
    fetchGroupData() {
      this.isLoading = true
      this.fetchGroup({
        id: this.$route.params.meetingId,
        limit: this.isSimpleMode ? 15 : '',
      })
        .then(() => {
          this.group?.meeting?.isStart && !this.socketIo && this.initSocketIo()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    simpleToggle() {
      this.isSimpleMode = !this.isSimpleMode
      this.fetchGroupData()
    },
    initSocketIo() {
      this.socketIo = io(process.env.NUXT_ENV_RESTAPI_BASE_URL)
      this.socketIo.emit('join', this.$route.params.meetingId)
      this.socketIo.on('RECOGNITION_DATA_ADDED', () => {
        this.fetchGroupData()
      })
    },
  },
}
</script>
