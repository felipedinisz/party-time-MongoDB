<template>
  <div>
    <Message :msg="msg" :msgClass="msgClass" />
    <form
      enctype="multipart/form-data"
      id="party-form"
      @submit="page === 'newparty' ? createParty($event) : update($event)"
    >
      <input type="hidden" id="id" name="id" v-model="id" />
      <input type="hidden" id="user_id" name="user_id" v-model="user_id" />
      <div class="input-container">
        <label for="title">Título do evento:</label>
        <input
          type="text"
          name="title"
          id="title"
          v-model="title"
          placeholder="Digite o título"
        />
      </div>
      <div class="input-container">
        <label for="description">Título do evento:</label>
        <textarea
          name="description"
          id="description"
          v-model="description"
          placeholder="Como foi o evento?"
        ></textarea>
        <div class="input-container">
          <label for="partyDate">Data do evento:</label>
          <input
            type="date"
            name="partyDate"
            id="partyDate"
            v-model="partyDate"
          />
        </div>
        <div class="input-container">
          <label for="photos" id="label_photos">Imagens</label>
          <input
            type="file"
            name="photos"
            id="photos"
            multiple="multiple"
            ref="file"
            @change="onChange($event)"
          />
        </div>
        <div v-if="page === 'editparty' && showMiniImages" class="mini-images">
          <p>Imagens atuais:</p>
          <img
            v-for="(photo, index) in photos"
            :src="`${photo}`"
            :key="index"
          />
        </div>
        <div class="checkbox-container">
          <label for="privacy">Evento privado?</label>
          <input type="checkbox" name="privacy" id="privacy" />
        </div>
      </div>
      <InputSubmit :text="btnText" />
    </form>
  </div>
</template>

<script>
import Message from "./Message.vue";
import InputSubmit from "./Form/inputSubmit.vue";

export default {
  name: "PartyForm",
  props: ["party", "page", "btnText"],
  data() {
    return {
      id: this.party._id || null,
      title: this.party.title || null,
      description: this.party.description || null,
      partyDate: this.party.partyDate || null,
      photos: this.party.photos || null,
      privacy: this.party.privacy || false,
      user_id: this.party.userId || null,
      msg: null,
      msgClass: null,
      showMiniImages: true,
    };
  },
  components: {
    Message,
    InputSubmit,
  },
  methods: {
    async createParty(e) {
      e.preventDefault();
    },
    onChange(e) {
      this.photos = e.target.files;
      this.showMiniImages = false;
    },
    async update(e) {
      e.preventDefault();
    },
  },
};
</script>

<style scoped>
#party-form {
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

#label_photos {
  width: 200px;
  text-transform: uppercase;
  color: #fff;
  background: #25282e;
  border: 0;
  border-radius: 5px;
  font-size: 0.9rem;
  padding: 12px;
  cursor: pointer;
  margin-top: 10px;
  text-align: center;
  transition: 0.5s;
}

#label_photos:hover {
  background-color: #141619;
}

input[type="file"] {
  display: none;
}

.input-container input,
.input-container textarea {
  padding: 10px;
  border: 1px solid #e8e8e8;
}

.input-container textarea {
  max-width: 400px;
  min-width: 400px;
  min-height: 70px;
  margin-bottom: 10px;
}
.checkbox-container {
  flex-direction: row;
}

.checkbox-container input[type="checkbox"] {
  margin-left: 12px;
  margin-top: 3px;
}
.mini-images {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 0px;
}
.mini-images p {
  width: 100%;
  font-weight: bold;
  margin-bottom: 15px;
  text-align: left;
}
.mini-images img {
  height: 50px;
  margin-right: 15px;
  margin-bottom: 15px;
}


</style>
