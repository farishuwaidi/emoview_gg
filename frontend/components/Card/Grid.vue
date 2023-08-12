<template>
  <v-row>
    <v-col v-for="item in items" :key="item._id" cols="12" sm="6" md="4" lg="3">
      <v-card outlined :to="{ name: to, params: { [params]: item._id } }">
        <v-card-title class="justify-space-between font-weight-regular">
          <span>{{ item.code || item.name }}</span>
          <div v-if="item.isStart" class="recording me-3" />
        </v-card-title>
        <v-card-subtitle class="text-truncate" :class="isRoom && 'py-1'">{{
          isRoom
            ? $dayjs(item.createdAt).format('DD MMM YYYY, HH:mm')
            : item.email
        }}</v-card-subtitle>
        <v-card-text
          v-if="isRoom"
          class="d-flex align-center justify-space-between pb-2"
        >
          <span class="text-truncate">{{ item.description }}</span>
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click.prevent
                ><v-icon>mdi-dots-horizontal</v-icon></v-btn
              >
            </template>
            <v-list>
              <DialogEditRoom
                :id="item._id"
                :code="item.code"
                :description="item.description"
                @refetch="$emit('refetch')"
              />
              <DialogDeleteRoom
                :id="item._id"
                :code="item.code"
                @refetch="$emit('refetch')"
              />
            </v-list>
          </v-menu>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'CardGrid',
  props: {
    isRoom: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      default() {
        return []
      },
    },
    to: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      actions: [
        { id: 1, text: 'Edit', dialog: false },
        { id: 2, text: 'Delete', dialog: false },
      ],
    }
  },
  computed: {
    params() {
      return this.to.split('-').pop()
    },
  },
}
</script>
