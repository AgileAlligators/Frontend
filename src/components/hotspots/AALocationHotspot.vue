<template>
  <AAHotspotWrapper
    class="aa-location-hotspot"
    title="Bewegungsmuster"
    endpoint="location/hotspot"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAHotspotWrapper from './AAHotspotWrapper.vue';

@Component({ components: { AAHotspotWrapper } })
export default class AALocationHotspot extends Vue {}
</script>
