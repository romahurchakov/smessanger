<template>
  <header class="header">
    <div class="wrapper">
      <router-link :to="{name:'home'}" class="wrapper__logo">
        <img src="../../assets/images/keklol.png" width="150" />
      </router-link>
      <Navigation class="wrapper__nav" />
      <Auth class="wrapper__auth" v-if="!isAuth" />
    </div>
  </header>
</template>



<script>
import Auth from "./Auth/Auth.vue";
import Navigation from "./Navigation/Navigation.vue";
import store from "@/store/store";

export default {
  name: "Header",
  components: {
    Auth,
    Navigation
  },
  computed: {
    getActive() {
      return this.$route.name;
    },
    isAuth() {
      return store.getters["user/name"];
    }
  },
};
</script>


<style scoped lang="scss">
.header {
  background-image: url(./../../assets/images/connectivity1.jpg);
  background-size: 100%;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 250px;
}

.wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  max-width: 1240px;

  &__logo {
    justify-self: left;
    padding: 10px;
  }

  &__nav {
    justify-self: center;
  }

  &__auth {
    justify-self: right;
    align-self: flex-start;
    margin-left: 50px;
    margin-top: 20px;
  }
}
</style>

<style>
header .el-menu-item {
  background-color: unset !important;
}
header .el-menu {
  background-color: unset !important;
}
</style>
