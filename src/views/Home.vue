<template>
  <AAView class="view-home">Home</AAView>
</template>

<script lang="ts">
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({
  components: {
    AAView,
  },
})
export default class Home extends Vue {}
</script>

<style lang="scss" scoped>
.view-home {
  //
}
</style>
