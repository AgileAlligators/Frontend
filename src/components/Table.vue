<template>
  <div>
    <h1>Table</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Workload</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in getTableData()" :key="item.ID">
          <td>{{ item.ID }} </td>
          <td>{{ item.type }} </td>
          <td>{{ item.workload }} </td>
          <td>{{ item.timestamp }} </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
    }
  }, 
  methods: {
    getTableData() {
      // randomly generated data to fill table
      const testData = [];
      const tableRows = 100;
      let id = 0;
      const types: string[] = ['Type 1', "Type 2", "Type 3"];
      for (let n = 0; n < tableRows;n++) {
        const temp = {
          ID: id,
          type: types[n % 3],
          workload: Math.random() * 100,
          timestamp: "10:00:00"
        }
        testData.push(temp);
        id++;
      }
      return testData;
    }
  }
}
</script>

<style lang="scss" scoped>
</style>