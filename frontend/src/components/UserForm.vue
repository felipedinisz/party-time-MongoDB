<template>
  <div>
    <Message :msg="msg" :msgClass="msgClass" />
    <form
      id="user-form"
      @submit="page === 'register' ? register($event) : update($event)"
    >
      <div class="input-container">
        <label for="name">Nome:</label>
        <!--eslint-disable-next-line prettier/prettier-->
        <input
          type="text"
          name="name"
          id="name"
          v-model="name"
          placeholder="Digite seu nome"
          autocomplete="off"
        />
      </div>
      <div class="input-container">
        <label for="email">E-mail:</label>
        <!--eslint-disable-next-line prettier/prettier-->
        <input
          type="text"
          name="email"
          id="email"
          v-model="email"
          placeholder="Digite seu e-mail"
          autocomplete="off"
        />
      </div>
      <div class="input-container">
        <label for="password">Senha:</label>
        <!--eslint-disable-next-line prettier/prettier-->
        <input
          type="password"
          name="password"
          id="password"
          v-model="password"
          placeholder="Digite sua senha"
          autocomplete="off"
        />
      </div>
      <div class="input-container">
        <label for="confirmpassword">Confirmar senha:</label>
        <!--eslint-disable-next-line prettier/prettier-->
        <input
          type="password"
          name="confirmpassword"
          id="confirmpassword"
          v-model="confirmpassword"
          placeholder="Digite sua senha"
          autocomplete="off"
        />
      </div>
      <inputSubmit :text="btnText" />
    </form>
  </div>
</template>

<script>
import inputSubmit from "./Form/inputSubmit.vue";
import Message from "./Message.vue";

export default {
  name: "RegisterForm",
  data() {
    return {
      name: null,
      email: null,
      password: null,
      confirmpassword: null,
      msg: null,
      msgClass: null,
    };
  },
  props: ["user", "page", "btnText"],
  components: {
    inputSubmit,
    Message,
  },
  methods: {
    async register(e) {
      e.preventDefault();

      const data = {
        name: this.name,
        email: this.email,
        password: this.password,
        confirmpassword: this.confirmpassword,
      };

      const jsonData = JSON.stringify(data);

      await fetch("http://127.0.0.1:3000/api/auth/register", {
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
            console.log(auth);
            // Emit event for auth an user
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
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
};
</script>

<style scoped>
#user-form {
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
