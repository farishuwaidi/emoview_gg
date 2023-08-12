<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" class="mb-6" />
    <MiscLoginFirst v-if="!$auth.loggedIn" />
    <HomeDashboard v-else />
  </v-container>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      breadcrumbsItems: [
        {
          text: 'Home',
          disabled: true,
        },
      ],
    }
  },
  head: {
    title: 'Home',
  },
  created() {
    if (this.$auth.hasScope('student')) this.$auth.logout()
  },
}
</script>
