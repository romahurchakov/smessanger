<template>
  <div class="app">
    <Header />
    <div class="view">
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

export default {
  name: "App",
  components: {
    Header,
    Footer
  }
};
</script>

<style>
.app {
  min-height: 100vh !important;
}

.view {
  min-height: 70vh;
}
</style>
