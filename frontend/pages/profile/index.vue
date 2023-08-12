<template>
  <v-container>
    <BaseHeader text="Profile" class="text-center" />
    <v-card class="mx-auto mb-3" max-width="600" outlined>
      <v-img
        src="https://images.unsplash.com/photo-1589859762194-eaae75c61f64?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=829&q=80"
        alt="background-image"
        height="200"
      >
        <template #placeholder>
          <v-skeleton-loader class="mx-auto" type="image"></v-skeleton-loader>
        </template>
      </v-img>
      <v-card-text class="text--primary px-6 py-0">
        <div class="d-flex justify-space-between">
          <v-img
            :src="profile?.picture"
            :alt="profile?.name"
            class="rounded-circle mb-4 mt-n13"
            max-width="100"
          />
          <DialogEditName :name="profile?.name" @refetch="fetchProfile" />
        </div>
        <div>
          <p class="text-h6 mb-2">{{ profile?.name }}</p>
          <p>{{ profile?.email }}</p>
        </div>
      </v-card-text>
      <v-card-subtitle class="my-0 pt-1 px-6">
        <v-icon small class="me-1">mdi-calendar-blank</v-icon>
        <span class="mt-2 mb-2"
          >Joined {{ $dayjs(profile?.created_at).format('YYYY') }}</span
        >
      </v-card-subtitle>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProfileIndexPage',
  middleware: 'auth',
  head: {
    title: 'Profile',
  },
  computed: {
    ...mapGetters('profile', ['profile']),
  },
  methods: {
    ...mapActions('profile', ['fetchProfile']),
  },
}
</script>
