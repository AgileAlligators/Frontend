<template>
  <AAView class="view-about">
    <select v-model="selected">
      <template v-for="item in options">
        <option :value="item" :key="item">
          {{ item }}
        </option>
      </template>
    </select>
    <LineDiagram v-if="selected === 'Line Chart'" />
    <BarChart v-else-if="selected === 'Bar Chart'" />
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';
import LineDiagram from '@/components/LineDiagram.vue';
import BarChart from '@/components/BarChart.vue';

@Component({ components: { AAView, LineDiagram, BarChart } })
export default class About extends Vue {
  selected = '';
  options = ['Line Chart', 'Bar Chart'];

  created(): void {
    this.selected = this.options[0];
  }
}
</script>

<style lang="scss" scoped>
.view-about {
  //
}
</style>
