<template>
  <AAView class="view-home">
    <Table />
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';
import Table from '@/components/Table.vue';

@Component({
  components: {
    AAView,
    Table,
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped></style>
