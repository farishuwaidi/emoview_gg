<template>
  <v-dialog v-model="dialog" width="600px" persistent>
    <template #activator="{ on, attrs }">
      <v-btn
        color="primary"
        class="text-capitalize mt-4"
        outlined
        v-bind="attrs"
        v-on="on"
      >
        Edit Profile
      </v-btn>
    </template>
    <v-card>
      <v-card-title>
        <p class="text-h5 mb-0">Edit Profile</p>
      </v-card-title>
      <v-form ref="form" v-model="isValid" @submit.prevent="editNameData">
        <v-card-text>
          <v-text-field
            v-model="data.name"
            label="Name *"
            hide-details="auto"
            class="mx-auto"
            :rules="$rules.name"
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
  name: 'DialogEditName',
  props: {
    name: {
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
      this.data = { name: this.name }
    },
  },
  methods: {
    ...mapActions('profile', ['editName']),
    editNameData() {
      this.editName({ data: this.data })
        .then(() => {
          this.$snackbar({ content: 'Name updated' })
        })
        .catch(() => {
          this.$snackbar({ content: "Can't update name", color: 'error' })
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
