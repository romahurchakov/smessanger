<template>
  <div>
    <el-menu
      :default-active="getActive"
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="#ffd04b"
      background-color="#091928"
      :router="true"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.label"
        :index="item.linkTo"
        :disabled="item.disabled"
        :route="{ name: item.linkTo}"
      >{{ item.label }}</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  computed: {
    getActive() {
      return this.$route.name;
    }
  },
  data() {
    return {
      menuItems: [
        { label: "Главная", linkTo: "home", disabled: false },
        { label: "Новости", linkTo: "news-page", disabled: false },
        { label: "Абитуриенту", linkTo: "entrant", disabled: false },
        { label: "Наука", linkTo: "", disabled: false },
      ],
      name: ""
    };
  }
};
</script>

<style lang="scss">
</style>
