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
          <i :class="item.icon"></i>
          {{ item.label }}
        </div>
      </el-menu-item>
      <el-submenu index="1" v-if="isAdmin">
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
      <el-menu-item
        v-if="!isNewsEditor"
        index="news"
        :route="{ name: 'news'}"
        >
          <div>
            <i class="el-icon-news"></i>
            Управление новостями
          </div>
        </el-menu-item>
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
      return !!store.getters["user/isAdmin"];
    },
    isNewsEditor() {
      return !!store.getters["user/isNewsEditor"]
    },
    isTeacher() {
      return !!store.getters["user/isTeacher"];
    },

  },
  data() {
    return {
      menuItems: [
        { label: "Работы", linkTo: "labs", disabled: false, icon:"el-icon-menu", if: true },
        {label: "Чаты", linkTo: "chats", disabled: false, icon:"el-icon-s-promotion", if: true},
        {label: "Настройка групп", linkTo: "group-settings-my", disabled: false, icon:"el-icon-s-custom", if: true },
        {label: "Управление лабораторными", linkTo: "task-management", disabled: false, icon:"el-icon-tickets", if: this.isTeacher},
        {label: "Отчеты", linkTo: "reports", disabled: false, icon:"el-icon-folder-opened", if: this.isTeacher},
      ],
      adminMenuItems: [
        { label: "Настройка пользователей", linkTo: "user-settings", disabled: false },
        { label: "Настройка групп", linkTo: "group-settings", disabled: false },
      ],
      name: ""
    };
  }
};
</script>

<style lang="scss">
</style>
