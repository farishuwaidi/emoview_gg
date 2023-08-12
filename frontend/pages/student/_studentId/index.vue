<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" />
    <CardWrapper title="Profile">
      <div class="text-center">
        <v-img
          :src="studentDetail?.picture"
          :alt="studentDetail?.name"
          class="rounded-circle mx-auto mb-4"
          max-width="100"
        />
        <p class="text-h6 mb-2">{{ studentDetail?.name }}</p>
        <p>{{ studentDetail?.email }}</p>
        <v-icon small class="me-1">mdi-calendar-blank</v-icon>
        <span class="mt-2 mb-2"
          >Joined {{ $dayjs(studentDetail?.created_at).format('YYYY') }}</span
        >
      </div>
    </CardWrapper>
    <v-row
      v-if="studentOverview?.datas?.length && studentSummary?.datas?.length"
    >
      <v-col>
        <CardWrapper title="Overview" :height="450">
          <ChartRadar :data="studentOverview" />
        </CardWrapper>
      </v-col>
      <v-col>
        <CardWrapper title="Summary" :height="450">
          <ChartDoughnut :data="studentSummary" />
        </CardWrapper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'StudentStudentIdPage',
  middleware: 'auth',
  data() {
    return {
      isLoading: { detail: false, overview: false, summary: false },
    }
  },
  head() {
    return {
      title: this.studentDetail?.name,
    }
  },
  computed: {
    ...mapGetters('student', [
      'studentDetail',
      'studentOverview',
      'studentSummary',
    ]),
    breadcrumbsItems() {
      return [
        {
          text: 'Student',
          disabled: false,
          exact: true,
          to: { name: 'student' },
        },
        {
          text: this.studentDetail?.name,
          disabled: true,
        },
      ]
    },
  },
  mounted() {
    this.fetchStudentDetailData()
    this.fetchStudentOverviewData()
    this.fetchStudentSummaryData()
  },
  methods: {
    ...mapActions('student', [
      'fetchStudentDetail',
      'fetchStudentOverview',
      'fetchStudentSummary',
    ]),
    fetchStudentDetailData() {
      this.isLoading = { ...this.isLoading, detail: true }
      this.fetchStudentDetail({
        id: this.$route.params.studentId,
      }).finally(() => {
        this.isLoading = { ...this.isLoading, detail: false }
      })
    },
    fetchStudentOverviewData() {
      this.isLoading = { ...this.isLoading, overview: true }
      this.fetchStudentOverview({
        id: this.$route.params.studentId,
      }).finally(() => {
        this.isLoading = { ...this.isLoading, overview: false }
      })
    },
    fetchStudentSummaryData() {
      this.isLoading = { ...this.isLoading, summary: true }
      this.fetchStudentSummary({
        id: this.$route.params.studentId,
      }).finally(() => {
        this.isLoading = { ...this.isLoading, summary: false }
      })
    },
  },
}
</script>
