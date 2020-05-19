<template>
  <div>
    <el-menu
      :default-active=getActive
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="#ffd04b"
      background-color="#091928"
      router=true
    >
      <el-menu-item index="home" :route="{name:'home'}">Профиль</el-menu-item>
      <!-- <el-menu-item index="2">Новости</el-menu-item> -->
      <el-menu-item index="entrant" :route="{name:'entrant'}">Абитуриентам</el-menu-item>
      <el-menu-item index="" :route="{name:'home'}" disabled=true>Студентам</el-menu-item>
      <el-menu-item index="" :route="{name:'home'}" disabled=true>Учебные планы</el-menu-item>
      <el-menu-item index="" :route="{name:'home'}" disabled=true>Документы</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  computed: {
    getActive() {
      return this.$route.name
    }
  }
};
</script>

<style lang="scss">
</style>
