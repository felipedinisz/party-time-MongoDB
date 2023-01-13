<template>
  <input type="submit" :value="text" />
</template>

<script>
export default {
  name: "inputSubmit",
  props: {
    // eslint-disable-next-line vue/require-prop-type-constructor
    text: "",
  },
};
</script>

<style scoped>
input {
  width: 200px;
  margin: 0 auto;
  text-transform: uppercase;
  color: #fff;
  background: #25282e;
  border: 0;
  border-radius: 5px;
  padding: 12px;
  cursor: pointer;
  margin-top: 10px;
  transition: 0.5s;
}

input:hover {
  background-color: #141619;
}
</style>
