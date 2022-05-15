<template>
  <AASection
    v-pex="'account.create'"
    class="aa-account-create-account"
    title="Neuen Account erstellen"
  >
    <div class="inputs">
      <AAFormInput v-model="dto.username" title="Username" />
      <AAFormInput v-model="dto.password" type="password" title="Passwort" />
      <AAFormInput
        v-model="dto.passwordR"
        type="password"
        title="Passwort wiederholen"
      />
    </div>
    <vm-button
      title="Account erstellen"
      variant="border"
      background="success"
      :disabled="sending || disabled"
      @click="createAccount"
    />
  </AASection>
</template>

<script lang="ts">
import { backend } from '@/utils/backend';
import { sendNotification } from '@/utils/functions';
import { Vue, Component, Prop } from 'vue-property-decorator';
import AAFormInput from '../forms/elements/AAFormInput.vue';
import AASection from '../AASection.vue';
import { User } from '@/utils/authenticator';

@Component({ components: { AASection, AAFormInput } })
export default class AAAccountCreateAccount extends Vue {
  @Prop({ default: () => [] }) accounts!: User[];

  public sending = false;
  public dto = {
    username: '',
    password: '',
    passwordR: '',
  };

  public get disabled(): boolean {
    return Object.values(this.dto).some((x) => !x || x.length === 0);
  }

  public createAccount(): void {
    if (this.sending) return;

    const { password, passwordR } = this.dto;
    if (password !== passwordR) {
      sendNotification({
        title: 'Account kann nicht erstellt werden',
        text: 'Das Passwort stimmt nicht überein',
      });
      return;
    }

    this.sending = true;
    backend
      .post('account', this.dto)
      .then(({ data }) => {
        sendNotification({
          title: 'Account erstellt!',
          text: `${data.username} kann nun zum Login verwendet werden`,
        });

        const update = [...this.accounts, data];
        console.log('accounts', update);

        this.$emit('accounts', update);
      })
      .catch(({ messages }) =>
        sendNotification({
          title: 'Account nicht erstellt',
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
.aa-account-create-account {
  .inputs {
    display: grid;
    grid-gap: 10px;
    max-width: 300px;
    margin-bottom: 10px;
  }
}
</style>
