<template>
  <div>
    <Navbar />
    <router-view class="container" />
    <Footer />
  </div>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Navbar,
    Footer,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  color: #444;
  font-family: Helvetica;
}

.container {
  min-height: 300px;
}

a {
  transition: 0.5s;
}

a:hover {
  color: #c1b696;
}
</style>
