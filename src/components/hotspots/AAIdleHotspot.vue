<template>
  <AASection class="aa-idle-hotspot" title="Standzeiten">
    <div id="map" />
  </AASection>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import L from 'leaflet';
import AASection from '../AASection.vue';
import 'leaflet/dist/leaflet.css';

@Component({ components: { AASection } })
export default class AAIdleHotspot extends Vue {
  mounted(): void {
    const map = L.map('map', {
      center: [49.4683841, 8.4823945],
      zoom: 18,
      attributionControl: false,
      zoomControl: false,
      fadeAnimation: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.circle([49.4683841, 8.4823945], {
      color: '#419F52',
      radius: 10,
    }).addTo(map);

    L.circle([49.4682841, 8.4824945], {
      color: '#08f',
      radius: 12,
    }).addTo(map);
  }
}
</script>

<style lang="scss" scoped>
.aa-idle-hotspot {
  #map {
    height: 500px;
    border-radius: $border-radius;
    overflow: hidden;
    background: rgba(var(--vm-container), 1);
  }
}
</style>
