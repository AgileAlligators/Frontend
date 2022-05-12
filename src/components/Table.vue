<template>
  <div>
    <FilterDialog v-if="filterDialog" @clicked="filterTable" />
    <h1>Current Sort: {{ currentSort }} : {{ currentSortDir }}</h1>
    <AAIconButton @click="filterDialog = true"> <aiFilter /> </AAIconButton>
    <table>
      <thead>
        <tr>
          <template v-for="value in ['id', 'type', 'customer']">
            <th :key="value">
              <div class="header-container">
                {{ value }}
                <div class="arrow-container">
                  <div @click="sort(value, 'asc')">
                    <aiChevronLeftVue
                      class="arrow-icon"
                      :class="{
                        'selected-sort':
                          currentSort === value && currentSortDir === 'asc',
                      }"
                    />
                  </div>
                  <div @click="sort(value, 'desc')">
                    <aiChevronRightVue
                      class="arrow-icon"
                      :class="{
                        'selected-sort':
                          currentSort === value && currentSortDir === 'desc',
                      }"
                      @click="sort(value, 'desc')"
                    />
                  </div>
                </div>
              </div>
            </th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in table" :key="item.id">
          <template v-if="filter(item)">
            <td>{{ item.id }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.customer }}</td>
          </template>
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
import filterStore from '@/store/filterStore';
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
    currentFilter() {
      return filterStore.getters.filterSettings;
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
      const types: string[] = ['Haube', 'Motor'];
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
          type: types[n % 2],
          customer: customers[Math.floor(Math.random() * customers.length)],
        };
        testData.push(temp);
        idNumber++;
      }
      this.table = testData;
    },
    sort(sort: string, direction: string): void {
      this.currentSort = sort;
      this.currentSortDir = direction;
    },
    filterTable(): void {
      this.filterDialog = false;
    },
    filter(item: { id: number; type: string; customer: string }): boolean {
      if (
        this.currentFilter[item.type] === true ||
        this.currentFilter[item.customer] === true
      ) {
        return false;
      } else {
        return true;
      }
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
  transform: rotate(90deg) !important;
}
.arrow-container {
  width: 20px;
  padding-left: 10px;
}
.selected-sort {
  color: rgba(var(--vm-primary), 1);
}
</style>
