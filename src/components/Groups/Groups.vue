<template>
  <main class="page_kek">
    <div class="mb-40">
      <p class="text-style"></p>
    </div>
    <article>
      <Table :tableData="tableData" @update-table="updateTable"/>
    </article>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import Table from "./Table.vue";
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
    ...mapActions("user", ["GET_GROUPS_MY", "GET_ROLES"]),
    onTabClickandler() {},
    async updateTable() {
      try {
        var users = await this.GET_GROUPS_MY({filter:""});
        users = users.filter(elem => !elem.is_study)
        var i;
        for (i = 0; i < users.length; i++) {
          users[i].num = 0;
          if (users[i].users) {
            users[i].num = users[i].users.length;
          }
        }
        this.tableData = users;
      } catch (err) {
        this.$notify.error({
          title: "Ошибка!",
          message: err.message
        });
      }
    }
  },
  async mounted() {
    try {
      var users = await this.GET_GROUPS_MY({filter:""});
      users = users.filter(elem => !elem.is_study)
      var i;
      for (i = 0; i < users.length; i++) {
        users[i].num = 0;
        if (users[i].users) {
          users[i].num = users[i].users.length;
        }
      }
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

<style lang="scss" scoped>
.page_kek {
  width: 80%;
}
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
