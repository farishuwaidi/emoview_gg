<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" />
    <BaseHeader text="Student:" />
    <CardGrid v-if="students.length" :items="students" to="student-studentId" />
    <MiscNoData v-else context="student" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'StudentPage',
  middleware: 'auth',
  data() {
    return {
      breadcrumbsItems: [
        {
          text: 'Student',
          disabled: true,
        },
      ],
      isLoading: false,
    }
  },
  head: {
    title: 'Student',
  },
  computed: {
    ...mapGetters('student', ['students']),
  },
  mounted() {
    this.fetchStudentsData()
  },
  methods: {
    ...mapActions('student', ['fetchStudents']),
    fetchStudentsData() {
      this.isLoading = true
      this.fetchStudents({ meetingId: '' }).finally(() => {
        this.isLoading = false
      })
    },
  },
}
</script>
