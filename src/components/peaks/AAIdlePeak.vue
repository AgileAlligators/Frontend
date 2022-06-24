<template>
  <AAPeakWrapper
    class="aa-idle-peak"
    title="Standzeitspitzen"
    endpoint="location/idle/search"
    :filter="{ minIdle: 10 }"
    type="time"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAPeakWrapper from './AAPeakWrapper.vue';

@Component({ components: { AAPeakWrapper } })
export default class AAIdlePeak extends Vue {}
</script>

<style lang="scss" scoped>
.aa-idle-peak {
  //
}
</style>
