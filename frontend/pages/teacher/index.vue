<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" />
    <BaseHeader text="Teacher:" />
    <CardGrid
      v-if="teachers?.length"
      :items="teachers"
      to="teacher-teacherId"
    />
    <MiscNoData v-else context="teacher" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TeacherPage',
  middleware: 'auth',
  data() {
    return {
      breadcrumbsItems: [
        {
          text: 'Teacher',
          disabled: true,
        },
      ],
      isLoading: false,
    }
  },
  head: {
    title: 'Teacher',
  },
  computed: {
    ...mapGetters('teacher', ['teachers']),
  },
  mounted() {
    this.fetchTeachersData()
  },
  methods: {
    ...mapActions('teacher', ['fetchTeachers']),
    fetchTeachersData() {
      this.isLoading = true
      this.fetchTeachers({ meetingId: '' }).finally(() => {
        this.isLoading = false
      })
    },
  },
}
</script>
