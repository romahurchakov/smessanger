<template>
  <main class="page">
    <div class="mb-40">
      <p class="text-style"></p>
    </div>
    <article>
      <Table :tableData="tableData"/>
    </article>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import Table from "./Table.vue"
export default {
  components: {
    Table
  },
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    ...mapActions("user", ["GET_GROUPS", "GET_ROLES"]),
    onTabClickandler() {}
  },
  async mounted() {
    try {
      const users = await this.GET_GROUPS();
      this.tableData = users;
    } catch (err) {
      this.$notify.error({
        title: "Ошибка!",
        message: err.message
      });
    }
  }
};
</script>

<style lang="scss">
.tab-opener {
  animation: animate 0.7s ease-in-out;
}
@keyframes animate {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
