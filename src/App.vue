<template>
  <div class="app">
    <Header />
    <div class="view">
      <div v-if="!isAuth">
        <div class="right">
          <router-view></router-view>
        </div>
      </div>
      <div v-else class="flex">
        <div class="left">
          <SideBar />
        </div>
        <div class="right">
          <router-view></router-view>
        </div>
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
}

.left {
  width: 319px;
  min-width: 319px;
}

.right {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
