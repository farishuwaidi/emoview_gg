<template>
  <v-container>
    <BaseBreadcrumbs :items="breadcrumbsItems" />
    <CardWrapper v-model="selectedType" :title="title[0]" :type-list="typeList">
      <ChartLine
        :data="data?.recognitionsDetail"
        :name="name"
        :meeting="meeting"
        :is-show-image="isShowImage"
        :is-simple-mode="isSimpleMode"
        :selected-type="selectedType"
        @simple-toggle="$emit('simple-toggle')"
        @refresh="$emit('refresh')"
      />
    </CardWrapper>
    <v-row v-if="selectedType === 'Expression'">
      <v-col :sm="12" :lg="6">
        <CardWrapper :is-popup="true" :title="title[1]" :height="450">
          <ChartRadar :data="data?.recognitionsOverview" />
        </CardWrapper>
      </v-col>
      <v-col :sm="12" :lg="6">
        <CardWrapper :is-popup="true" :title="title[2]" :height="450">
          <ChartDoughnut :data="data?.recognitionsSummary" />
        </CardWrapper>
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <CardWrapper :is-popup="true" :title="title[2]">
          <MiscValenceArousel :data="data?.valenceArousalSummary" />
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
  data() {
    return {
      selectedType: 'Expression',
    }
  },
  computed: {
    typeList() {
      return ['Expression', 'Valence Arousal']
    },
  },
}
</script>
