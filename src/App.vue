<template>
  <div class="app">
    <Header />
    <div class="view">
      <div v-if="!isAuth">
        <router-view></router-view>
      </div>
      <div v-else class="flex">
        <div class="left">
          <SideBar />
        </div>
        <router-view></router-view>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SideBar from "./components/SideBar/SideBar";
import store from "@/store/store";

export default {
  name: "App",
  components: {
    Header,
    Footer,
    SideBar
  },
  computed: {
    isAuth() {
      return store.getters["user/name"];
    }
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

.flex {
  display: flex;
  justify-content: center;
}

.left {
  position: absolute;
  left: 0;
}
</style>
