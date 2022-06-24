<template>
  <AAPeakWrapper
    class="aa-vibration-peak"
    title="Vibrationsspitzen"
    endpoint="vibration/search"
    :filter="{ minVibration: 0.5 }"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAPeakWrapper from './AAPeakWrapper.vue';

@Component({ components: { AAPeakWrapper } })
export default class AAVibrationPeak extends Vue {}
</script>

<style lang="scss" scoped>
.aa-vibration-peak {
  //
}
</style>
