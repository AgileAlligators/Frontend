<template>
  <AASection
    class="aa-peak-wrapper"
    :title="title"
    :subtitle="
      $date($store.state.time.start) +
      ' - ' +
      $date($store.state.time.end) +
      ' Uhr'
    "
  >
    <vm-flow slot="title">
      <vm-spinner size="5px" v-if="controller" />
      <AAIconButton
        @click="exportAsPNG"
        v-title="'Bild herunterladen'"
        icon="download"
      />
      <AAIconButton
        @click="$store.commit('dialog_filter', true)"
        v-title="'Ladungsträger filtern'"
        icon="filter"
      />
    </vm-flow>

    <div class="map-container">
      <div class="map-wrapper">
        <div ref="map" id="map" />
      </div>
      <div ref="info" id="info" class="hidden">
        <div ref="cId" />
        <div ref="val" />
        <div ref="ts" />
      </div>
    </div>
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import {
  carrierDetails,
  date,
  getCounter,
  scale,
  strippedFilter,
  time,
  toPercent,
} from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAIconButton from '../AAIconButton.vue';
import AASection from '../AASection.vue';
import AAFormInput from '../forms/elements/AAFormInput.vue';
import { EventBus } from '@/utils/constants';

import View from 'ol/View';
import Map from 'ol/Map';
import { Heatmap as HeatmapLayer, Tile as TileLayer } from 'ol/layer';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import Point from 'ol/geom/Point';
import Feature from 'ol/Feature';
import MapBrowserEvent from 'ol/MapBrowserEvent';
import { Pixel } from 'ol/pixel';

interface Peak {
  id: string;
  carrierId: string;
  coordinates: [number, number];
  timestamp: number;
  vibration?: number;
  idle?: number;
}

@Component({ components: { AASection, AAIconButton, AAFormInput } })
export default class AAPeakWrapper extends Vue {
  @Prop({ required: true }) title!: string;
  @Prop({ required: true }) endpoint!: string;
  @Prop() filter!: Record<string, number>;
  @Prop() type!: string;

  $refs!: {
    map: HTMLDivElement;
    info: HTMLDivElement;
    cId: HTMLDivElement;
    val: HTMLDivElement;
    ts: HTMLDivElement;
  };

  public heat = new HeatmapLayer({
    blur: 20,
    radius: 12,
    source: new VectorSource({ features: [] }),
    weight: (feature) => scale(feature.get('opacity'), 0, 1, 0.1, 1),
  });

  public map = new Map({});

  public peaks: Peak[] = [];
  public controller: AbortController | null = null;

  mounted(): void {
    this.map = new Map({
      target: this.$refs.map,
      layers: [new TileLayer({ source: new OSM() }), this.heat],
      view: new View({
        center: fromLonLat([8.4823945, 49.4683841]),
        zoom: 17,
        constrainResolution: true,
      }),
    });
    this.map.on('pointermove', (e: MapBrowserEvent<PointerEvent>) => {
      if (e.dragging) this.$refs.info.classList.add('hidden');
      else this.displayFeatureInfo(e.pixel);
    });
    this.map.on('click', (e: MapBrowserEvent<PointerEvent>) => {
      this.displayFeatureInfo(e.pixel, true);
    });

    this.loadData();
    EventBus.$on('reload-carriers', this.loadData);
  }

  public displayFeatureInfo(pixel: Pixel, isClick = false): void {
    const { info, cId, val, ts } = this.$refs;

    const feature = this.map.forEachFeatureAtPixel(pixel, function (feature) {
      return feature;
    });

    if (feature) {
      info.style.left = pixel[0] + 'px';
      info.style.top = pixel[1] + 'px';

      const v = feature.get('val');

      cId.innerText = 'LT#' + feature.get('cId');
      val.innerText = this.type === 'time' ? time(v) : v;
      ts.innerText = feature.get('ts') + ' Uhr';

      if (isClick)
        carrierDetails(feature.get('carrierId'), feature.get('timestamp'));

      info.classList.remove('hidden');
    } else info.classList.add('hidden');
  }

  public updatePoints(): void {
    this.peaks.forEach(
      ({ id, carrierId, coordinates, timestamp, vibration, idle }) => {
        const feature = this.heat.getSource()?.getFeatureById(id);

        if (feature) {
          const v = vibration || idle || 0;
          let opacity = v;
          if (this.type === 'time') opacity = v / 60;

          const cId = getCounter(carrierId);
          const val = this.type === 'time' ? v : toPercent(v);
          const ts = date(timestamp);

          const geometry = new Point(
            fromLonLat([Math.min(...coordinates), Math.max(...coordinates)])
          );

          feature.setGeometry(geometry);
          feature.setProperties({
            cId,
            val,
            ts,
            opacity,
            carrierId,
            timestamp,
          });
        }
      }
    );
  }

  public loadData(): void {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();
    const signal = this.controller.signal;

    backend
      .post<{ results: Peak[] }>(
        this.endpoint,
        { ...strippedFilter(), ...this.filter, limit: 300 },
        { signal }
      )
      .then(({ data }) => {
        this.peaks = data.results;

        this.heat.getSource()?.addFeatures(
          this.peaks.map(({ id }) => {
            const feature = new Feature({ opacity: 0 });
            feature.setId(id);
            return feature;
          })
        );

        this.updatePoints();

        if (this.peaks.length > 0) {
          const center = this.peaks[0].coordinates;
          this.map.getView().setCenter(fromLonLat(center.reverse()));
        }

        this.controller = null;
      });
  }

  public exportAsPNG(): void {
    this.map.once('rendercomplete', () => {
      const mapCanvas = document.createElement('canvas');
      const size = this.map.getSize();
      if (!size) return;
      mapCanvas.width = size[0];
      mapCanvas.height = size[1];
      const mapContext = mapCanvas.getContext('2d');
      if (!mapContext) return;

      Array.prototype.forEach.call(
        this.map
          .getViewport()
          .querySelectorAll('.ol-layer canvas, canvas.ol-layer'),
        (canvas) => {
          if (canvas.width > 0) {
            const opacity =
              canvas.parentNode.style.opacity || canvas.style.opacity;
            mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);

            const backgroundColor = canvas.parentNode.style.backgroundColor;
            if (backgroundColor) {
              mapContext.fillStyle = backgroundColor;
              mapContext.fillRect(0, 0, canvas.width, canvas.height);
            }

            let matrix;
            const transform = canvas.style.transform;
            if (transform) {
              matrix = transform
                .match(/^matrix\(([^(]*)\)$/)[1]
                .split(',')
                .map(Number);
            } else {
              matrix = [
                parseFloat(canvas.style.width) / canvas.width,
                0,
                0,
                parseFloat(canvas.style.height) / canvas.height,
                0,
                0,
              ];
            }
            // Apply the transform to the export map context
            CanvasRenderingContext2D.prototype.setTransform.apply(
              mapContext,
              matrix
            );
            mapContext.drawImage(canvas, 0, 0);
          }
        }
      );

      mapContext.globalAlpha = 1;

      const a = document.createElement('a');
      a.href = mapCanvas.toDataURL();
      a.download = this.title;
      a.click();
      URL.revokeObjectURL(a.href);
    });
    this.map.renderSync();
  }
}
</script>

<style lang="scss">
.aa-peak-wrapper #map .ol-control {
  background: rgba(127, 127, 127, 0.25);
  backdrop-filter: saturate(180%) blur(20px);
  padding: 5px;
  button {
    background: rgba(var(--vm-primary), 0.5);
    cursor: pointer;
    &:hover {
      background: rgba(var(--vm-primary), 1);
    }
  }
}
</style>

<style lang="scss" scoped>
.aa-peak-wrapper {
  .map-container {
    border-radius: $border-radius;
    z-index: 0;
    overflow: hidden;
    background: rgba(var(--vm-container), 1);

    #map {
      height: 500px;
      z-index: 0;
    }

    height: 500px;

    #info {
      position: absolute;
      transform: translate(-50%, -100%);
      z-index: 10;
      pointer-events: none;

      white-space: nowrap;
      font-weight: 500;
      padding: 10px;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;

      border-radius: $border-radius;
      background: rgba(#000, 0.5);
      backdrop-filter: saturate(180%) blur(20px);
      color: #fff;

      transition: 0.5s cubic-bezier(0.075, 0.82, 0.165, 1);
      transition-property: opacity, transform;
      &.hidden {
        transform: translate(-50%, 0%) scale(0);
        opacity: 0;
      }

      // carrierId
      div:nth-child(1) {
        text-transform: uppercase;
        margin-bottom: 0.5em;
        font-size: 0.875em;
        font-weight: bold;
      }

      // value
      div:nth-child(2) {
        font-size: 1.75em;
        font-weight: bold;
      }

      // timestamp
      div:nth-child(3) {
        margin-top: 0.5em;
        font-size: 0.75em;
        font-weight: 600;
      }
    }

    position: relative;
  }
}
</style>
