<template>
  <AASection
    v-pex="'account.change.permissions'"
    class="aa-account-change-permissions"
    title="Berechtigungen ändern"
  >
    <div class="inputs">
      <AAFormSelect
        title="Account"
        :values="accounts"
        :multiple="false"
        :value="accountId"
        @input="setAccount"
      />
    </div>
    <vm-revealer>
      <vm-grid v-if="accountId" width="270px" gap="0">
        <span class="empty" />
        <vm-list-item v-for="(_, k) in dto" :key="k" :title="k">
          <vm-checkbox
            slot="action"
            :value="dto[k]"
            @input="$set(dto, k, $event)"
          />
        </vm-list-item>
      </vm-grid>
    </vm-revealer>
    <vm-button
      title="Berechtigungen speichern"
      variant="border"
      background="alarm"
      :disabled="sending || !accountId"
      @click="changePermissions"
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
export default class AAAccountChangePermissions extends Vue {
  @Prop({ default: () => [] }) accounts!: User[];

  public sending = false;
  public accountId: string | null = null;

  public dto: Record<string, boolean> = {};

  mounted(): void {
    backend.get('account/permissions').then(({ data }) => {
      data.forEach((p: string) => {
        this.dto[p] = false;
      });
    });
  }

  public setAccount(accountId: string | null): void {
    this.accountId = accountId;
    if (accountId) {
      const account = this.accounts.filter((x) => x.id === accountId)[0];
      Object.keys(this.dto).forEach((k) => {
        this.dto[k] = account.permissions.includes(k);
      });
    }
  }

  public changePermissions(): void {
    if (this.sending || !this.accountId) return;
    this.sending = true;

    const perms = Object.entries(this.dto)
      .filter((x) => x[1])
      .map(([key]) => key);

    backend
      .patch('account/permissions/' + this.accountId, { permissions: perms })
      .then(({ data }) => {
        sendNotification({
          title: `Berechtigungen ${data ? 'erfolgreich' : 'nicht'} geändert!`,
        });
        if (data) {
          const update = this.accounts.map((x) => {
            if (x.id !== this.accountId) return x;
            return { ...x, permissions: perms };
          });
          this.$emit('accounts', update);
        }
      })
      .catch(({ messages }) =>
        sendNotification({
          title: 'Fehler beim Ändern der Berechtigungen',
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
.aa-account-change-permissions {
  .inputs {
    display: grid;
    grid-gap: 10px;
    max-width: 300px;
    margin-bottom: 10px;
  }
  .vm-grid .empty {
    position: absolute;
  }
}
</style>
