<template>
  <AAView class="view-guide">
    <AASection title="Ladungsträger filtern">
      <p>
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Esse possimus
        a quia dicta repellat? Itaque, ea autem quos consectetur rem obcaecati
        debitis ratione unde iste, enim eum ab, placeat recusandae.
      </p>
      <!-- <img src="guide/NAME.png" alt=""> -->
    </AASection>
    <AASection title="Ladungsträger auswählen">
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti
        dignissimos beatae labore nihil eius non deleniti quod exercitationem
        suscipit qui totam omnis accusamus voluptas id, culpa ut itaque officiis
        tenetur?
      </p>
    </AASection>
    <AASection title="Ladungsträger auswählen">
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti
        dignissimos beatae labore nihil eius non deleniti quod exercitationem
        suscipit qui totam omnis accusamus voluptas id, culpa ut itaque officiis
        tenetur?
      </p>
    </AASection>
  </AAView>
</template>

<script lang="ts">
import AASection from '@/components/AASection.vue';
import AAView from '@/components/AAView.vue';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AAView, AASection } })
export default class Guide extends Vue {}
</script>

<style lang="scss" scoped>
.view-guide {
  //
}
</style>
