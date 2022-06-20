<template>
  <AAHotspotWrapper
    class="aa-idle-hotspot"
    title="Standzeitentwicklung"
    endpoint="location/idle/hotspot"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAHotspotWrapper from './AAHotspotWrapper.vue';

@Component({ components: { AAHotspotWrapper } })
export default class AAIdleHotspot extends Vue {}
</script>
