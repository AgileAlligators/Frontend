<template>
  <AASection
    v-pex="'account.change.group'"
    class="aa-account-change-group"
    title="Gruppe ändern"
  >
    <div class="inputs">
      <AAFormSelect
        title="Account"
        :values="accounts"
        :multiple="false"
        :value="accountId"
        @input="accountId = $event"
      />

      <AAFormSelect
        title="Gruppe"
        :values="[
          { id: 'admin', title: 'Admin' },
          { id: 'default', title: 'Standard' },
        ]"
        :multiple="false"
        :value="group"
        @input="group = $event"
      />
    </div>
    <vm-button
      title="Gruppe ändern"
      variant="border"
      background="alarm"
      :disabled="sending || !accountId || !group"
      @click="changeGroup"
    />
  </AASection>
</template>

<script lang="ts">
import { User } from '@/utils/authenticator';
import { backend } from '@/utils/backend';
import { sendNotification } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAFormSelect from '../forms/elements/AAFormSelect.vue';
import AASection from '../AASection.vue';

@Component({ components: { AASection, AAFormSelect } })
export default class AAAccountChangeGroup extends Vue {
  @Prop({ default: () => [] }) accounts!: User[];

  public sending = false;
  public accountId: string | null = null;
  public group: string | null = null;

  public changeGroup(): void {
    if (this.sending) return;
    if (!this.accountId && !this.group) return;

    this.sending = true;
    backend
      .patch('account/group/' + this.accountId, { group: this.group })
      .then(({ data }) => {
        sendNotification({
          title: `Gruppe ${data ? 'erfolgreich' : 'nicht'} geändert!`,
        });
        if (data) {
          const update = this.accounts.map((a) => {
            if (a.id !== this.accountId) return a;
            return { ...a, group: this.group };
          });

          this.$emit('accounts', update);
        }
      })
      .catch(({ messages }) =>
        sendNotification({
          title: 'Fehler beim Ändern der Gruppe',
          text: messages[0],
        })
      )
      .then(() => {
        this.sending = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.aa-account-change-group {
  .inputs {
    display: grid;
    grid-gap: 10px;
    max-width: 300px;
    margin-bottom: 10px;
  }
}
</style>
