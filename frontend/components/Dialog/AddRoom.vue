<template>
  <v-dialog v-model="dialog" width="600px" persistent>
    <template #activator="{ on, attrs }">
      <v-btn
        color="primary"
        class="text-capitalize"
        aria-label="Add Room"
        depressed
        v-bind="attrs"
        v-on="on"
        ><v-icon class="me-2">mdi-plus</v-icon>Add Room</v-btn
      >
    </template>
    <v-card>
      <v-card-title>
        <p class="text-h5 mb-0">Add Room</p>
      </v-card-title>
      <v-form ref="form" v-model="isValid" @submit.prevent="addMeetingData">
        <v-card-text>
          <v-text-field
            v-model="data.code"
            label="Room ID *"
            hint="Example: abc-defg-hij"
            hide-details="auto"
            class="mx-auto"
            maxlength="12"
            :rules="$rules.roomId"
            outlined
            persistent-hint
          ></v-text-field>
          <v-text-field
            v-model="data.description"
            label="Description *"
            hide-details="auto"
            class="mx-auto"
            :rules="$rules.description"
            outlined
          ></v-text-field>
        </v-card-text>
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
            type="submit"
            color="primary"
            class="text-capitalize me-2"
            min-height="40"
            :disabled="!isValid"
            depressed
            >Save</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'DialogAddRoom',
  data() {
    return {
      data: {},
      dialog: false,
      isValid: false,
    }
  },
  watch: {
    'data.code'(value) {
      if (!value) return
      this.data.code = this.$autoDash(value)
    },
  },
  methods: {
    ...mapActions('meeting', ['addMeeting']),
    addMeetingData() {
      this.addMeeting({ data: this.data })
        .then(() => {
          this.$snackbar({ content: 'Room created' })
        })
        .catch(() => {
          this.$snackbar({ content: "Can't create room", color: 'error' })
        })
        .finally(() => {
          this.closeDialog()
          this.$emit('refetch')
        })
    },
    closeDialog() {
      this.$refs.form.reset()
      this.dialog = !this.dialog
    },
  },
}
</script>
