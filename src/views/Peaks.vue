<template>
  <AAView class="view-peaks">
    <AATimeRange slot="static" />

    <AAIdlePeak />
    <AAVibrationPeak />
  </AAView>
</template>

<script lang="ts">
import AATimeRange from '@/components/AATimerange.vue';
import AAView from '@/components/AAView.vue';
import AAIdlePeak from '@/components/peaks/AAIdlePeak.vue';
import AAVibrationPeak from '@/components/peaks/AAVibrationPeak.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AAView, AATimeRange, AAVibrationPeak, AAIdlePeak } })
export default class Peaks extends Vue {}
</script>

<style lang="scss" scoped>
.view-peaks {
  //
}
</style>
