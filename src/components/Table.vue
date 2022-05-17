<template>
  <div>
    <table>
      <thead>
        <tr>
          <template v-for="value in ['id', 'type', 'customer', 'timestamp']">
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
              <AAIconButton @click="selectEntry">
                <div>{{ item.id }}</div>
                <div>{{ item.type }}</div>
                <div>{{ item.customer }}</div>
                <div>{{ item.timestamp }}</div>
              </AAIconButton>
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
import AAIconButton from '@/components/AAIconButton.vue';
export default Vue.extend({
  components: {
    aiChevronLeftVue,
    aiChevronRightVue,
    AAIconButton,
  },
  data() {
    return {
      table: [] as {
        id: number;
        type: string;
        customer: string;
        timestamp: string;
      }[],
      currentSort: 'id' as string,
      currentSortDir: 'asc' as string,
      filterDialog: false as boolean,
    };
  },
  computed: {
    sortedTable(): {
      id: number;
      type: string;
      customer: string;
      timestamp: string;
    }[] {
      const sortedTable = this.table;
      return sortedTable.sort(
        (
          a: { id: number; type: string; customer: string; timestamp: string },
          b: { id: number; type: string; customer: string; timestamp: string }
        ) => {
          let modifier = 1;
          if (this.currentSortDir === 'desc') {
            modifier = -1;
          }
          type ObjectKey = keyof typeof a;
          const currentSort = this.currentSort as ObjectKey;

          let entryA: string | number | Date = a[currentSort];
          let entryB: string | number | Date = b[currentSort];
          if (this.currentSort === 'timestamp') {
            entryA = new Date(entryA);
            entryB = new Date(entryB);
          }
          if (entryA < entryB) {
            return -1 * modifier;
          } else if (entryA > entryB) {
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
        const date = new Date(
          new Date(2020, 0, 1).getTime() +
            Math.random() *
              (new Date(2022, 5, 16).getTime() - new Date(2020, 0, 1).getTime())
        );
        const currentTimeStamp = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const temp = {
          id: idNumber,
          type: types[n % 2],
          customer: customers[Math.floor(Math.random() * customers.length)],
          timestamp: currentTimeStamp,
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
        this.currentFilter.type[item.type] === true ||
        this.currentFilter.customer[item.customer] === true
      ) {
        return false;
      } else {
        return true;
      }
    },
    selectEntry(): void {
      this.$router.push({ name: 'about' });
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
    text-align: start;
  }
}
.table-header {
  min-width: 150px;
  float: left;
}
</style>
