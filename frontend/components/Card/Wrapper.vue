<template>
  <v-card class="my-6" :height="height ? height : ''" outlined>
    <v-card-title
      v-if="title === 'Detail'"
      class="font-weight-regular justify-space-between"
    >
      <div>{{ title }}</div>
      <v-select
        :value="value"
        :items="typeList"
        style="max-width: 200px"
        hide-details="auto"
        outlined
        dense
        @input="$emit('input', $event)"
      ></v-select>
    </v-card-title>
    <v-card-title v-else class="font-weight-regular justify-space-between">
      {{ title }}
    </v-card-title>
    <v-card-text class="text--primary">
      <slot />
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'CardWrapper',
  props: {
    title: {
      type: String,
      default: '',
    },
    height: {
      type: Number,
      default: 0,
    },
    value: {
      type: String,
      default: '',
    },
    typeList: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
