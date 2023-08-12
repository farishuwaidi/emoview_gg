<template>
  <v-breadcrumbs class="pa-0" :items="items">
    <template #divider>
      <v-icon>mdi-chevron-right</v-icon>
    </template>
  </v-breadcrumbs>
</template>

<script>
export default {
  name: 'BaseBreadcrumbs',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
