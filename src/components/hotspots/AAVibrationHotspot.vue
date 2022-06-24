<template>
  <AAHotspotWrapper
    class="aa-vibration-hotspot"
    title="Vibrationen"
    endpoint="vibration/hotspot"
    type="vibration"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAHotspotWrapper from './AAHotspotWrapper.vue';

@Component({ components: { AAHotspotWrapper } })
export default class AAVibrationHotspot extends Vue {}
</script>
