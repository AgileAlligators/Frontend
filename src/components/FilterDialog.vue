<template>
  <div class="aa-filter-dialog">
    <h1>Filter Dialog</h1>
    <AAIconButton @click="closeFilterDialog()">Abbrechen</AAIconButton>
    <AAIconButton @click="saveFilterOptions()">Speichern</AAIconButton>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AAIconButton from '@/components/AAIconButton.vue';

@Component({
  components: {
    AAIconButton,
  },
  methods: {
    closeFilterDialog() {
      this.$emit('clicked');
    },
  },
})
export default class AA extends Vue {}
</script>

<style lang="scss" scoped>
.aa-filter-dialog {
  position: fixed;
  top: 20%;
  left: 40%;
  width: 400px;
  height: 300px;
  border: 1px solid black;
}
</style>
