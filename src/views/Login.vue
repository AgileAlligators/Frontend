<template>
  <div class="view-login">
    <vm-dialog :value="true" :closeable="false">
      <AADialogHeader title="CMS" about="Login" />

      <vm-revealer>
        <p v-if="error" highlight>
          Username und Passwort stimmen nicht überein!
        </p>
      </vm-revealer>

      <form @submit.prevent="login" autocomplete="on">
        <AAFormInput
          :showRemove="false"
          title="Username"
          :disabled="sending"
          autocomplete="username"
          v-model="dto.username"
        />
        <br />
        <AAFormInput
          :showRemove="false"
          title="Passwort"
          :disabled="sending"
          type="password"
          autocomplete="current-password"
          v-model="dto.password"
        />
      </form>

      <vm-dialog-button
        slot="footer"
        title="Anmelden"
        :disabled="sending"
        @click="login"
      />
    </vm-dialog>
  </div>
</template>

<script lang="ts">
import AAFormInput from '@/components/forms/elements/AAFormInput.vue';
import AADialogHeader from '@/components/dialogs/AADialogHeader.vue';
import { Authenticator } from '@/utils/authenticator';
import { backend } from '@/utils/backend';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AADialogHeader, AAFormInput } })
export default class Login extends Vue {
  public sending = false;
  public error = false;

  public logoStyle = {
    height: '1em',
    marginRight: '.25em',
  };
  public titleStyle = {
    fontSize: '1.3rem',
    fontWeight: 550,
    display: 'flex',
    alignItems: 'center',
  };
  public subtitleStyle = {
    fontSize: '1.1rem',
    color: 'rgba(var(--vm-color-secondary), 1)',
    marginBottom: '20px',
  };

  public dto = {
    username: '',
    password: '',
  };

  public login(): void {
    this.sending = true;
    this.error = false;
    backend
      .post('account/login', this.dto)
      .then(({ data }) => Authenticator.signIn(data))
      .catch(() => {
        this.error = true;
      })
      .finally(() => {
        this.sending = false;
      });
  }
}
</script>

<style lang="scss" scoped>
.view-login {
  .title {
    font-size: 1.3rem;
    font-weight: 550;
    display: flex;
    justify-content: center;
    svg {
      height: 1em;
    }
  }
  .subtitle {
    font-size: 1.1rem;
    color: rgba(var(--vm-color-secondary), 1);
  }
}
</style>
