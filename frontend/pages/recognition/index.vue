<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" />
    <div class="d-flex align-center justify-space-between">
      <BaseHeader text="Room:" />
      <DialogAddRoom @refetch="fetchMeetings" />
    </div>
    <CardGrid
      v-if="meetings?.length"
      :is-room="true"
      :items="meetings"
      to="recognition-meetingId"
      @refetch="fetchMeetings"
    />
    <MiscNoData v-else context="room" />
  </v-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'RecognitionIndexPage',
  middleware: 'auth',
  data() {
    return {
      breadcrumbsItems: [
        {
          text: 'Recognition',
          disabled: true,
        },
      ],
    }
  },
  head: {
    title: 'Recognition',
  },
  computed: {
    ...mapGetters('meeting', ['meetings']),
  },
  mounted() {
    this.fetchMeetings()
  },
  methods: {
    ...mapActions('meeting', ['fetchMeetings']),
  },
}
</script>
