<template>
  <AAView class="view-about">About</AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AAView } })
export default class About extends Vue {}
</script>

<style lang="scss" scoped>
.view-about {
  //
}
</style>
