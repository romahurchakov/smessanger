<template>
  <main class="page">
    <div class="wrapper">
      <div class="flex">
        <div class="mb-24">
          <p class="hint-text mb-8">ФИО</p>
          <p class="text-style">{{ user.fio }}</p>
        </div>
        <div class="mb-24">
          <p class="hint-text mb-8">Логин</p>
          <p class="text-style">{{ user.login }}</p>
        </div>
      </div>
      <div class="flex">
        <div class="mb-24">
          <p class="hint-text mb-8">Группа</p>
          <el-input placeholder="Группа" v-model="user.group" />
        </div>
      </div>
      <div class="flex">
        <div class="mb-24">
          <p class="hint-text mb-8">Телефон</p>
          <el-input placeholder="Телефон" v-model="user.phone" />
        </div>
        <div class="mb-24">
          <p class="hint-text mb-8">Почта</p>
          <el-input placeholder="Почта" v-model="user.email" />
        </div>
      </div>
      <div class="flex">
        <div class="mb-24 w150">
          <p class="hint-text mb-8">Новый пароль</p>
          <el-input placeholder="Пароль" v-model="user.password" />
        </div>
        <div class="mb-24 w150">
          <p class="hint-text mb-8">Роль</p>
          <el-select v-model="role" placeholder="Роли" class="w150">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
          </el-select>
        </div>
      </div>
      <el-switch
        style="display: block"
        v-model="checked"
        active-color="#13ce66"
        active-text="Администратор"
        @change="changeAdmin"
      ></el-switch>
      <el-switch
        style="display: block; margin-top: 10px;"
        v-model="checked_redactor"
        active-color="#13ce66"
        active-text="Редактор"
        @change="changeAdmin"
      ></el-switch>
      <Button type="primary" label="Подтвердить" @click="updateUser" class="button" />
    </div>
  </main>
</template>

<script>
import { mapActions } from "vuex";
import Button from "@/components/ui/Button/Button";

export default {
  components: {
    Button
  },
  data() {
    return {
      user: {},
      roles: [],
      checked: false,
      admin_id: "",
      role: {},
      checked_redactor: false,
    };
  },
  methods: {
    ...mapActions("user", ["GET_ROLES", "GET_USER", "UPDATE_USER"]),
    changeAdmin() {
      this.checked = !!this.checked;
    },
    async updateUser() {
      this.user.roles = [{id: this.role}]
      if (this.checked) {
          this.user.roles.push({id: this.admin_id})
      }

      try {
        const result = await this.UPDATE_USER(this.user);
        this.user = result;
      } catch (e) {
        console.log(e);
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    }
  },
  async mounted() {
    try {
      const result = await this.GET_ROLES();
      this.roles = result;
    } catch (e) {
      console.log(e);
      this.$notify.error({
        title: "Ошибка!",
        message: "Что-то пошло не так"
      });
    }

    var i;
    for (i = 0; i < this.roles.length; i++) {
      if (this.roles[i].name == "Администратор") {
        this.admin_id = this.roles[i].id;
      }
    }
    this.roles = this.roles.filter(elem => elem.name != "Администратор")

    try {
      const result = await this.GET_USER(this.$route.params.id);
      this.user = result;
    } catch (e) {
      this.$notify.error({
        title: "Ошибка!",
        message: "Что-то пошло не так"
      });
    }

    this.checked = false;
    for (i = 0; i < this.user.roles.length; i++) {
      if (this.user.roles[i].name == "Администратор") {
        this.checked = true;
      } else {
        this.role = this.user.roles[i].id;
        this.role_name = this.user.roles[i].name;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  width: 80%;
}
.wrapper {
  display: flex;
  padding: 20px;
  flex-direction: column;
  width: 100%;
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  min-width: 40vh;
  align-items: flex-start;
}

.w150 {
  width: 200px;
}

.button {
  align-self: flex-end;
  margin-top: 25px;
  width: 150px;
}
</style>
