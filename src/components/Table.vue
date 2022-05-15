<template>
  <div>
    <table>
      <thead>
        <tr>
          <template v-for="value in ['id', 'type', 'customer']">
            <th :key="value" class="table-header">
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
        <template v-for="item in table">
          <tr colspan="3" v-if="filter(item)" :key="item.id">
            <td class="list-entry">
              <div>{{ item.id }}</div>
              <div>{{ item.type }}</div>
              <div>{{ item.customer }}</div>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import aiChevronLeftVue from '@/icons/etc/aiChevronLeft.vue';
import aiChevronRightVue from '@/icons/etc/aiChevronRight.vue';
import Vue from 'vue';
import filterStore from '@/store/filterStore';
export default Vue.extend({
  components: {
    aiChevronLeftVue,
    aiChevronRightVue,
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
.arrow-container {
  width: 20px;
  padding-left: 10px;
}
.selected-sort {
  color: rgba(var(--vm-primary), 1);
}
svg {
  height: 20px;
  width: 20px;
  transform: rotate(90deg) !important;
}
.list-entry {
  border: 1px solid black;

  div {
    min-width: 150px;
    padding-right: 1px;
    padding-left: 1px;
    float: left;
  }
}
.table-header {
  min-width: 150px;
  float: left;
}
</style>
