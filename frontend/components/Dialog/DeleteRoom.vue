<template>
  <v-dialog v-model="dialog" width="600px" persistent>
    <template #activator="{ on, attrs }">
      <v-list-item v-bind="attrs" link v-on="on">
        <v-list-item-title>Delete</v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        <p class="text-h5 mb-0">Delete Room</p>
      </v-card-title>
      <v-card-text class="py-2"
        >Are you sure you want to delete {{ code }} room?</v-card-text
      >
      <v-card-actions class="pb-5">
        <v-spacer />
        <v-btn
          class="text-capitalize me-2"
          min-height="40"
          text
          @click="closeDialog"
          >Cancel</v-btn
        >
        <v-btn
          color="error"
          class="text-capitalize me-2"
          min-height="40"
          depressed
          @click="deleteMeetingData"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DialogDeleteRoom',
  props: {
    id: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialog: false,
    }
  },
  methods: {
    ...mapActions('meeting', ['deleteMeeting']),
    deleteMeetingData() {
      this.deleteMeeting({ id: this.id })
        .then(() => {
          this.$snackbar({ content: 'Room deleted' })
        })
        .catch(() => {
          this.$snackbar({ content: "Can't delete room", color: 'error' })
        })
        .finally(() => {
          this.closeDialog()
          this.$emit('refetch')
        })
    },
    closeDialog() {
      this.dialog = !this.dialog
    },
  },
}
</script>
