<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" />
    <SwitchRecognition
      :get-meeting-id="meetingDetail"
      @refetch="fetchMeetingDetailData"
    />
    <BaseLoading v-if="isLoading.meeting || isLoading.student" />
    <template v-else>
      <template v-if="students.length">
        <div v-for="typeItem in types" :key="typeItem._id">
          <BaseHeader :text="typeItem.type" class="mt-8" />
          <CardGrid :items="typeItem.items" :to="typeItem.to" />
        </div>
      </template>
      <MiscNoData v-else context="recognition" />
    </template>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RecognitionMeetingIdPage',
  middleware: 'auth',
  data() {
    return {
      isLoading: { meeting: false, student: false },
    }
  },
  head() {
    return {
      title: this.meetingDetail?.code,
    }
  },
  computed: {
    ...mapGetters('meeting', ['meetingDetail']),
    ...mapGetters('student', ['students']),
    types() {
      return [
        {
          id: 1,
          type: 'Group:',
          items: [{ _id: 1, name: 'All' }],
          to: 'recognition-meetingId-all',
        },
        {
          id: 2,
          type: 'Individual:',
          items: this.students,
          to: 'recognition-meetingId-studentId',
        },
      ]
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
          text: this.meetingDetail?.code,
          disabled: true,
        },
      ]
    },
  },
  mounted() {
    this.fetchMeetingDetailData()
    this.fetchStudentsData()
  },
  methods: {
    ...mapActions('meeting', ['fetchMeetingDetail']),
    ...mapActions('student', ['fetchStudents']),
    fetchMeetingDetailData() {
      this.isLoading.meeting = true
      this.fetchMeetingDetail({
        id: this.$route.params.meetingId,
      }).finally(() => {
        this.isLoading.meeting = false
      })
    },
    fetchStudentsData() {
      this.isLoading.student = true
      this.fetchStudents({
        meetingId: this.$route.params.meetingId,
      }).finally(() => {
        this.isLoading.student = false
      })
    },
  },
}
</script>
