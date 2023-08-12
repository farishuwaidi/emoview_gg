<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" />
    <CardWrapper :title="title[0]">
      <ChartLine
        :data="data?.recognitionsDetail"
        :name="name"
        :meeting="meeting"
        :is-show-image="isShowImage"
        :is-simple-mode="isSimpleMode"
        @simple-toggle="$emit('simple-toggle')"
        @refresh="$emit('refresh')"
      />
    </CardWrapper>
    <v-row>
      <v-col>
        <CardWrapper :is-popup="true" :title="title[1]" :height="450">
          <ChartRadar :data="data?.recognitionsOverview" />
        </CardWrapper>
      </v-col>
      <v-col>
        <CardWrapper :is-popup="true" :title="title[2]" :height="450">
          <ChartDoughnut :data="data?.recognitionsSummary" />
        </CardWrapper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'CardRecognition',
  props: {
    breadcrumbsItems: {
      type: Array,
      default() {
        return []
      },
    },
    title: {
      type: Array,
      default() {
        return []
      },
    },
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    name: {
      type: String,
      default: '',
    },
    meeting: {
      type: String,
      default: '',
    },
    isShowImage: {
      type: Boolean,
      default: false,
    },
    isSimpleMode: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
