<template>
  <div class="wrapper">
      <div class=wrapper__number> </div>
      <div class="wrapper__text"> {{ text }} </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  components: {},
  props: ["text"],
};
</script>

<style scoped lang="scss">
.wrapper {
  display: flex;
  width: fit-content;


  &__number {
      background-color: #ffd04b;
      align-self: stretch;
      width: 20px;
      border-radius: 10px;
  }

  &__text {
      margin-left: 10px;
  }
}
</style>
