<template>
  <AAView class="view-charts">
    <select v-model="selected">
      <template v-for="item in options">
        <option :value="item" :key="item">
          {{ item }}
        </option>
      </template>
    </select>
    <div>
      <label for="startTime">Anfangszeit:</label>
      <vm-input v-model="startingDate" type="date" />
    </div>
    <div>
      <label for="startTime">Endzeit:</label>
      <vm-input v-model="endingDate" type="date" />
    </div>
    <AAIconButton @click="updateTimeFrame">Diagramm aktualisieren</AAIconButton>
    <LineDiagram
      v-if="selected === 'Liniendiagramm'"
      :categories="chartTimeStamps"
      :data="chartLoadScale"
    />
    <BarChart
      v-else-if="selected === 'Balkendiagramm'"
      :categories="chartTimeStamps"
      :data="chartLoadScale"
    />
    <div v-if="Object.keys(selectedCarrier).length > 0">
      Ausgewählter Ladungsträger: {{ selectedCarrier }}
    </div>
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';
import LineDiagram from '@/components/LineDiagram.vue';
import BarChart from '@/components/BarChart.vue';
import AAIconButton from '@/components/AAIconButton.vue';
import { backend } from '@/utils/backend';
import filterStore from '@/store/filterStore';

@Component({ components: { AAView, LineDiagram, BarChart, AAIconButton } })
export default class Charts extends Vue {
  selected = '';
  options = ['Liniendiagramm', 'Balkendiagramm'];
  startingDate = '';
  endingDate = '';
  chartTimeStamps: string[] = [];
  chartLoadScale: string[] = [];

  get selectedCarrier(): {
    customer: string;
    id: number;
    order: string;
    type: string;
  } {
    return filterStore.getters.currentSelectedCarrier;
  }

  created(): void {
    this.selected = this.options[0];
  }
  updateTimeFrame(): void {
    // convert to unix
    const startTime = Math.floor(new Date(this.startingDate).getTime());
    const endTime = Math.floor(new Date(this.endingDate).getTime());
    if (startTime > endTime) {
      console.error('selected dates not correct');
      return;
    }
    if (this.selectedCarrier === undefined) {
      console.error('no carrier has been selected!');
      return;
    }
    const request = {
      ids: [String(this.selectedCarrier.id)],
      dataRequest: 'loadOverTime',
      start: startTime,
      end: endTime,
    };
    backend.post('diagram/line-diagram', request).then((response) => {
      if (response.data.length > 0) {
        console.error(response.data[0].dataPairs);
        const sortedResponseByDate = response.data[0].dataPairs.sort(function (
          a: [number, number],
          b: [number, number]
        ) {
          return a[0] - b[0];
        });
        sortedResponseByDate.forEach((element: number[]) => {
          this.chartTimeStamps.push(new Date(element[0]).toDateString());
          this.chartLoadScale.push(element[1].toFixed(2));
        });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.view-charts {
  //
}
</style>
