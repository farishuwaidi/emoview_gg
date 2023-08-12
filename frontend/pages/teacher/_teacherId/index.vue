<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" />
    <CardWrapper title="Profile">
      <div class="text-center">
        <v-img
          :src="teacherDetail?.picture"
          :alt="teacherDetail?.name"
          class="rounded-circle mx-auto mb-4"
          max-width="100"
        />
        <p class="text-h6 mb-2">{{ teacherDetail?.name }}</p>
        <p>{{ teacherDetail?.email }}</p>
        <v-icon small class="me-1">mdi-calendar-blank</v-icon>
        <span class="mt-2 mb-2"
          >Joined {{ $dayjs(teacherDetail?.created_at).format('YYYY') }}</span
        >
      </div>
    </CardWrapper>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'TeacherTeacherIdPage',
  middleware: 'auth',
  data() {
    return {
      isLoading: false,
    }
  },
  head() {
    return {
      title: this.teacherDetail?.name,
    }
  },
  computed: {
    ...mapGetters('teacher', ['teacherDetail']),
    breadcrumbsItems() {
      return [
        {
          text: 'Teacher',
          disabled: false,
          exact: true,
          to: { name: 'teacher' },
        },
        {
          text: this.teacherDetail?.name,
          disabled: true,
        },
      ]
    },
  },
  mounted() {
    this.fetchTeacherDetailData()
  },
  methods: {
    ...mapActions('teacher', ['fetchTeacherDetail']),
    fetchTeacherDetailData() {
      this.isLoading = true
      this.fetchTeacherDetail({
        id: this.$route.params.teacherId,
      }).finally(() => {
        this.isLoading = false
      })
    },
  },
}
</script>
