<template>
  <AAHotspotWrapper
    class="aa-load-hotspot"
    title="Beladungsentwicklung"
    endpoint="load/hotspot"
    type="load"
  />
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAHotspotWrapper from './AAHotspotWrapper.vue';

@Component({ components: { AAHotspotWrapper } })
export default class AALoadHotspot extends Vue {}
</script>
