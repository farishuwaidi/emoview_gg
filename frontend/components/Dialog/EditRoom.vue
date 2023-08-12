<template>
  <v-dialog v-model="dialog" width="600px" persistent>
    <template #activator="{ on, attrs }">
      <v-list-item v-bind="attrs" link v-on="on">
        <v-list-item-title>Edit</v-list-item-title>
      </v-list-item>
    </template>
    <v-card>
      <v-card-title>
        <p class="text-h5 mb-0">Edit Room</p>
      </v-card-title>
      <v-form ref="form" v-model="isValid" @submit.prevent="editMeetingData">
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
  name: 'DialogEditRoom',
  props: {
    id: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      data: {},
      dialog: false,
      isValid: false,
    }
  },
  watch: {
    dialog() {
      this.data = { code: this.code, description: this.description }
    },
    'data.code'(value) {
      if (!value) return
      this.data.code = this.$autoDash(value)
    },
  },
  methods: {
    ...mapActions('meeting', ['editMeeting']),
    editMeetingData() {
      this.editMeeting({ id: this.id, data: this.data })
        .then(() => {
          this.$snackbar({ content: 'Room updated' })
        })
        .catch(() => {
          this.$snackbar({ content: "Can't update room", color: 'error' })
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
