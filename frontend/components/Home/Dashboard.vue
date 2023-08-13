<template>
  <BaseLoading v-if="isLoading" />
  <div v-else-if="meeting && student">
    <v-row>
      <v-col v-for="highlight in highlights" :key="highlight.id" class="pb-0">
        <NuxtLink :to="{ name: highlight.to }" class="text-decoration-none">
          <v-alert
            color="primary"
            border="left"
            elevation="1"
            colored-border
            class="mb-0"
          >
            <v-card class="mx-1 mb-0" flat>
              <v-card-subtitle class="d-flex align-center px-0 pt-0">
                <v-icon class="me-3" size="28">{{ highlight.icon }}</v-icon>
                <span class="text--primary text-h6 font-weight-regular">{{
                  highlight.title
                }}</span>
              </v-card-subtitle>
              <p class="font-weight-bold mb-0">{{ highlight.data }}</p>
            </v-card>
          </v-alert>
        </NuxtLink>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" class="pt-0">
        <CardWrapper title="Average Overview" :height="450">
          <ChartRadar :data="overview" />
        </CardWrapper>
      </v-col>
      <v-col cols="12" md="6" class="pt-0">
        <CardWrapper title="Average Summary" :height="450">
          <ChartDoughnut :data="summary?.recognitionsSummary" />
        </CardWrapper>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <CardWrapper title="Average Valence Arousal" :is-popup="true">
          <MiscValenceArousel :data="summary?.valenceArousalSummary" />
        </CardWrapper>
      </v-col>
    </v-row>
  </div>
  <MiscGetStarted v-else />
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'HomeDashboard',
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters('aggregate', ['meeting', 'student', 'teacher']),
    ...mapGetters('recognition', ['overview', 'summary']),
    isSuperAdmin() {
      return this.$auth.hasScope('superadmin')
    },
    highlights() {
      const teacherHighlights = [
        {
          id: 1,
          icon: 'mdi-laptop-account',
          title: 'Room',
          to: 'recognition',
          data: this.meeting,
        },
        {
          id: 2,
          icon: 'mdi-account-multiple-outline',
          title: 'Student',
          to: 'student',
          data: this.student,
        },
      ]
      const superAdminHighlights = [
        ...teacherHighlights,
        {
          id: 3,
          icon: 'mdi-human-male-board',
          title: 'Teacher',
          to: 'teacher',
          data: this.teacher,
        },
      ]
      return this.isSuperAdmin ? superAdminHighlights : teacherHighlights
    },
  },
  mounted() {
    this.isLoading = true
    Promise.all([
      this.fetchMeeting(),
      this.fetchStudent(),
      this.fetchOverview(),
      this.fetchSummary(),
      this.isSuperAdmin && this.fetchTeacher(),
    ]).finally(() => {
      this.isLoading = false
    })
  },
  methods: {
    ...mapActions('aggregate', [
      'fetchMeeting',
      'fetchStudent',
      'fetchTeacher',
    ]),
    ...mapActions('recognition', ['fetchOverview', 'fetchSummary']),
  },
}
</script>
