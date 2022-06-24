<template>
  <vm-dialog
    class="aa-dialog-carrier"
    :value="$store.state.dialog_carrier"
    @input="$store.commit(name, $event)"
    background="background"
  >
    <vm-menu-button icon="cross" :filled="true" slot="button" @click="close" />
    <AADialogHeader :title="'LT#' + $counter(carrierId)" />

    <AASection>
      <table v-if="information">
        <tr>
          <th>Bauteil</th>
          <td>{{ information.type }}</td>
        </tr>
        <tr>
          <th>Kunde</th>
          <td>{{ information.customer }}</td>
        </tr>
        <tr>
          <th>Lieferung</th>
          <td>{{ information.order }}</td>
        </tr>
      </table>
    </AASection>

    <AASection title="Standzeiten" v-if="vibrationSeries.length > 0">
      <div class="chart-wrapper">
        <apexchart
          type="line"
          height="200"
          :options="$idleChart"
          :series="idleSeries"
        />
      </div>
    </AASection>

    <AASection
      title="Vollzeit / Leerzeit"
      v-if="loadOverTimeCategories.length > 0"
    >
      <div class="chart-wrapper">
        <apexchart
          type="bar"
          height="120"
          :options="{
            ...$loadOverTimeChart,
            xaxis: { categories: loadOverTimeCategories },
          }"
          :series="loadOverTimeSeries"
        />
      </div>
    </AASection>

    <AASection title="Beladung" v-if="vibrationSeries.length > 0">
      <div class="chart-wrapper">
        <apexchart
          type="line"
          height="200"
          :options="$loadChart"
          :series="loadSeries"
        />
      </div>
    </AASection>

    <AASection title="Erschütterungen" v-if="vibrationSeries.length > 0">
      <div class="chart-wrapper">
        <apexchart
          type="line"
          height="200"
          :options="$vibrationChart"
          :series="vibrationSeries"
        />
      </div>
    </AASection>
  </vm-dialog>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { EventBus } from '@/utils/constants';
import { getCounter, mapLoadOverTime, strippedFilter } from '@/utils/functions';
import { Component, Mixins } from 'vue-property-decorator';
import AASection from '../AASection.vue';
import { AADialogMixin } from './AADialog.mixin';

interface Payload {
  carrierId: string;
  timestamp: number;
}
interface Information {
  type: string;
  customer: string;
  order: string;
}
type Chart = { name: string; data: { x: number; y: number }[] };

@Component({ components: { AASection } })
export default class AADialogCarrier extends Mixins(AADialogMixin) {
  name = 'dialog_carrier';
  public carrierId = '';
  public timestamp = 0;
  public information: Information | null = null;
  public vibrationSeries: Chart[] = [];
  public loadSeries: Chart[] = [];
  public idleSeries: Chart[] = [];
  public loadOverTimeSeries = [];
  public loadOverTimeCategories = [];

  mounted(): void {
    EventBus.$on('carrier-details', ({ carrierId, timestamp }: Payload) => {
      this.carrierId = carrierId;
      this.timestamp = timestamp;
      this.information = null;
      this.loadData();
      this.$store.commit(this.name, true);

      //   62b16e484e33eff002446bf2
    });
  }

  public mapData(d: Chart[]): Chart[] {
    return d.map(({ name, data }) => {
      return {
        name: name.length === 24 ? 'LT#' + getCounter(name) : name,
        data,
      };
    });
  }

  public loadData(): void {
    backend.get('carrier/' + this.carrierId).then(({ data }) => {
      this.information = data;
    });

    const offset = 43200000; // 12h
    const opts = {
      ...strippedFilter(),
      ids: [this.carrierId],
      start: this.timestamp - offset,
      end: this.timestamp + offset,
    };

    backend
      .post('vibration/diagram', opts)
      .then(({ data }) =>
        this.$set(this, 'vibrationSeries', this.mapData(data))
      );

    backend
      .post('location/idle/diagram', opts)
      .then(({ data }) => this.$set(this, 'idleSeries', this.mapData(data)));

    backend
      .post('load/diagram', opts)
      .then(({ data }) => this.$set(this, 'loadSeries', this.mapData(data)));

    backend
      .post('load/diagram/time', opts)
      .then(({ data }) => mapLoadOverTime(data))
      .then(({ categories, series }) => {
        this.$set(this, 'loadOverTimeCategories', categories);
        this.$set(this, 'loadOverTimeSeries', series);
      });
  }
}
</script>

<style lang="scss">
.aa-dialog-carrier .vm-dialog {
  width: calc(90vw - env(safe-area-inset-left) - env(safe-area-inset-right));
  max-width: $max-width;
}
</style>

<style lang="scss" scoped>
.aa-dialog-carrier {
  table {
    border-collapse: collapse;
    margin: 0 -10px;

    th {
      text-align: left;
    }
    th,
    td {
      padding: 5px 10px;
    }
  }
  //

  .chart-wrapper {
    margin-top: -30px;

    @include aa-scrollbar();
    overflow: hidden;
  }
}
</style>
