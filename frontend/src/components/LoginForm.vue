<template>
  <div>
    <Message :msg="msg" :msgClass="msgClass" />
    <form @submit="login($event)" id="login-form">
      <div class="input-container">
        <label for="email">E-mail:</label>
        <input
          type="text"
          name="email"
          id="email"
          v-model="email"
          placeholder="digite seu e-mail"
        />
      </div>
      <div class="input-container">
        <label for="password">Senha:</label>
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          placeholder="digite sua senha"
        />
      </div>
      <InputSubmit text="Entrar" />
    </form>
  </div>
</template>

<script>
import InputSubmit from "./Form/inputSubmit.vue";
import Message from "./Message.vue";

export default {
  name: "Loginform",
  data() {
    return {
      email: null,
      password: null,
      msg: null,
      msgClass: null,
    };
  },
  components: {
    Message,
    InputSubmit,
  },
  methods: {
    async login(e) {
      e.preventDefault();

      const data = {
        email: this.email,
        password: this.password,
      };

      const jsonData = JSON.stringify(data);

      await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: jsonData,
      })
        .then((resp) => resp.json())
        .then((data) => {
          let auth = false;

          if (data.error) {
            this.msg = data.error;
            this.msgClass = "error";
          } else {
            auth = true;
            this.msg = data.msg;
            this.msgClass = "success";
            // Emite evento para autenticar usuário
            this.$store.commit("authenticate", {
              token: data.token,
              userId: data.userId,
            });
          }

          setTimeout(() => {
            const self = this;
            if (!auth) {
              this.msg = null;
            } else {
              self.$router.push("/dashboard");
            }
          }, 2000);
        });
    },
  },
};
</script>

<style scoped>
#login-form {
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

.input-container {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  text-align: left;
}

.input-container label {
  margin-bottom: 10px;
  color: #555;
}

.input-container input {
  padding: 10px;
  border: 1px solid #e2e1e1;
}
</style>
