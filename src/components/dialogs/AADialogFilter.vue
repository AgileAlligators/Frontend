<template>
  <vm-dialog
    class="aa-dialog-filter"
    :value="$store.state.dialog_filter"
    @input="$store.commit(name, $event)"
    background="background"
  >
    <vm-menu-button icon="cross" :filled="true" slot="button" @click="close" />
    <AADialogHeader title="Ladungsträger filtern" />

    <div class="inputs">
      <AAFormSelect
        title="Kunden"
        :values="customers"
        :value="$store.getters.filter.customers"
        :multiple="true"
        @input="$store.commit('filter_customers', $event)"
      />

      <AAFormSelect
        title="LT Arten"
        :values="types"
        :value="$store.getters.filter.types"
        :multiple="true"
        @input="$store.commit('filter_types', $event)"
      />

      <AAFormSelect
        title="Bestellungen"
        :values="orders"
        :value="$store.getters.filter.orders"
        :multiple="true"
        @input="$store.commit('filter_orders', $event)"
      />

      <AAFormSelect
        title="Bauteile"
        :values="components"
        :value="$store.getters.filter.components"
        :multiple="true"
        @input="$store.commit('filter_components', $event)"
      />
    </div>
  </vm-dialog>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { stringToSelectable } from '@/utils/functions';
import { Component, Mixins } from 'vue-property-decorator';
import AAFormSelect from '../forms/elements/AAFormSelect.vue';
import { AADialogMixin } from './AADialog.mixin';

interface Selectable {
  id: string;
  title: string;
}

@Component({ components: { AAFormSelect } })
export default class AADialogFilter extends Mixins(AADialogMixin) {
  name = 'dialog_filter';

  public customers: Selectable[] = [];
  public types: Selectable[] = [];
  public orders: Selectable[] = [];
  public components: Selectable[] = [];

  mounted(): void {
    backend.get('carrier/customers').then(({ data }) => {
      this.customers = data.map((d: string) => stringToSelectable(d));
      this.$store.commit('filter_customers', data);
    });
    backend.get('carrier/types').then(({ data }) => {
      this.types = data.map((d: string) => stringToSelectable(d));
      this.$store.commit('filter_types', data);
    });
    backend.get('carrier/orders').then(({ data }) => {
      this.orders = data.map((d: string) => stringToSelectable(d));
      this.$store.commit('filter_orders', data);
    });
    backend.get('carrier/components').then(({ data }) => {
      this.components = data.map((d: string) => stringToSelectable(d));
      this.$store.commit('filter_components', data);
    });
  }
}
</script>

<style lang="scss">
.aa-dialog-filter {
  .inputs {
    display: grid;
    grid-gap: 10px;
  }
  .vm-dialog__content {
    overflow: unset;
  }
}
</style>
