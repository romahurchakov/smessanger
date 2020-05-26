<template>
  <div>
    <el-menu
      :default-active="getActive"
      class="el-menu-vertical-demo"
      mode="vertical"
      active-text-color="#ffd04b"
      text-color="#091928"
      :router="true"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.label"
        :index="item.linkTo"
        :disabled="item.disabled"
        :route="{ name: item.linkTo}"
      >
        <div>
          <i class="el-icon-menu"></i>
          {{ item.label }}
        </div>
      </el-menu-item>
      <el-submenu index="1" :v-show="isAdmin">
        <template slot="title">
          <i class="el-icon-s-tools"></i>
          <span>Панель администратора</span>
        </template>
        <el-menu-item
          v-for="item in adminMenuItems"
          :key="item.label"
          :index="item.linkTo"
          :disabled="item.disabled"
          :route="{ name: item.linkTo}"
        >
          <div>
            <i class="el-icon-menu"></i>
            {{ item.label }}
          </div>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import store from "@/store/store";
export default {
  computed: {
    getActive() {
      return this.$route.name;
    },
    isAdmin() {
      return store.getters["user/isAdmin"];
    }
  },
  data() {
    return {
      menuItems: [{ label: "Лабораторные", linkTo: "labs", disabled: false }],
      adminMenuItems: [
        { label: "Настройка пользователей", linkTo: "user-settings", disabled: false },
        { label: "Настройка групп", linkTo: "group-settings", disabled: false },
        { label: "Управление сайтом", linkTo: "management", disabled: true }
      ],
      name: ""
    };
  }
};
</script>

<style lang="scss">
</style>
