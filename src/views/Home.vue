<template>
  <AAView class="view-home">
    <AACarrierTable />
  </AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';
import AACarrierTable from '@/components/AACarrierTable.vue';

@Component({ components: { AAView, AACarrierTable } })
export default class Home extends Vue {}
</script>
