<template>
  <div>
    <el-menu
      :default-active="getActive"
      class="el-menu-vertical-demo"
      mode="vertical"
      active-text-color="#ffd04b"
      text-color="#ffd04b"
      router="true"
    >
      <el-menu-item
        v-for="item in menuItems"
        :key="item.label"
        :index="item.linkTo"
        :disabled="item.disabled"
        :route="{ name: item.linkTo}"
      >
        <i class="el-icon-menu"></i>
        {{ item.label }}
      </el-menu-item>
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
      menuItems: [{ label: "Лабораторные", linkTo: "labs", disabled: false }],
      name: ""
    };
  }
};
</script>

<style lang="scss">
</style>
