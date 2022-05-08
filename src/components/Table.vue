<template>
  <div>
    <FilterDialog v-if="filterDialog" @clicked="filterDialog = false"/>
    <h1>Current Sort: {{ currentSort }} : {{ currentSortDir }}</h1>
    <AAIconButton @click="filterDialog = true"> <aiFilter /> </AAIconButton>
    <table>
      <thead>
        <tr>
          <template v-for="value in ['id', 'type', 'customer']">
            <th @click="sort(value)" :key="value">
              <div class="header-container">
                {{ value }}
                <aiChevronLeftVue
                  class="arrow-icon"
                  v-if="currentSort === value && currentSortDir === 'asc'"
                />
                <aiChevronRightVue
                  class="arrow-icon"
                  v-if="currentSort === value && currentSortDir === 'desc'"
                />
              </div>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in table" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.type }}</td>
          <td>{{ item.customer }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import aiChevronLeftVue from '@/icons/etc/aiChevronLeft.vue';
import aiChevronRightVue from '@/icons/etc/aiChevronRight.vue';
import aiFilter from '@/icons/etc/aiFilter.vue';
import FilterDialog from '@/components/FilterDialog.vue';
import AAIconButton from '@/components/AAIconButton.vue';
import Vue from 'vue';
export default Vue.extend({
  components: {
    aiChevronLeftVue,
    aiChevronRightVue,
    aiFilter,
    FilterDialog,
    AAIconButton,
  },
  data() {
    return {
      table: [] as { id: number; type: string; customer: string }[],
      currentSort: 'id' as string,
      currentSortDir: 'asc' as string,
      filterDialog: false as boolean,
    };
  },
  computed: {
    sortedTable(): { id: number; type: string; customer: string }[] {
      const sortedTable = this.table;
      return sortedTable.sort(
        (
          a: { id: number; type: string; customer: string },
          b: { id: number; type: string; customer: string }
        ) => {
          let modifier = 1;
          if (this.currentSortDir === 'desc') {
            modifier = -1;
          }
          type ObjectKey = keyof typeof a;
          const currentSort = this.currentSort as ObjectKey;
          if (a[currentSort] < b[currentSort]) {
            return -1 * modifier;
          } else if (a[currentSort] > b[currentSort]) {
            return 1 * modifier;
          } else {
            return 0;
          }
        }
      );
    },
  },
  watch: {
    sortedTable(newTable) {
      this.table = newTable;
    },
  },
  mounted() {
    this.initializeTableData();
  },
  methods: {
    initializeTableData(): void {
      // randomly generated data to fill table
      const testData = [];
      const tableRows = 100;
      let idNumber = 0;
      const types: string[] = ['Type 1', 'Type 2', 'Type 3'];
      const customers: string[] = [
        'Porsche',
        'Ferrari',
        'Bugatti',
        'Citroen',
        'BMW',
      ];
      for (let n = 0; n < tableRows; n++) {
        const temp = {
          id: idNumber,
          type: types[n % 3],
          customer: customers[Math.floor(Math.random() * customers.length)],
        };
        testData.push(temp);
        idNumber++;
      }
      this.table = testData;
    },
    sort(s: string): void {
      if (s === this.currentSort) {
        this.currentSortDir = this.currentSortDir === 'asc' ? 'desc' : 'asc';
      }
      this.currentSort = s;
    },

  },
});
</script>

<style lang="scss" scoped>
.header-container {
  display: flex;
  height: 50px;
}
svg {
  height: 20px;
  width: 20px;
}
</style>
