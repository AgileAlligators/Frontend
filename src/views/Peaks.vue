<template>
  <AAView class="view-peaks">
    <AAIdlePeak />
    <AAVibrationPeak />
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import AAIdlePeak from '@/components/peaks/AAIdlePeak.vue';
import AAVibrationPeak from '@/components/peaks/AAVibrationPeak.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AAView, AAVibrationPeak, AAIdlePeak } })
export default class Peaks extends Vue {}
</script>

<style lang="scss" scoped>
.view-peaks {
  //
}
</style>
