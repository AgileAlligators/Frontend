import AADialogHeader from '@/components/dialogs/AADialogHeader.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({ components: { AADialogHeader } })
export class AADialogMixin extends Vue {
  public name!: string;

  mounted(): void {
    this.$router.afterEach(() => {
      this.close();
    });

    window.addEventListener('keydown', this.closeListener);
    this.$once('hook:beforeDestroy', () => {
      window.removeEventListener('keydown', this.closeListener);
    });
  }

  private closeListener(e: KeyboardEvent): void {
    if (e.key === 'Escape') this.close();
  }

  public close(): void {
    this.$store.commit(this.name, false);
  }
}
