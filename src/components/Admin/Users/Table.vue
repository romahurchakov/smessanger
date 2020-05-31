<template>
  <div class="home">
    <div class="article">
      <div class="fl mb-24">
        <el-autocomplete
          class="autocomplete mr-24"
          v-model="autocompleteValue"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearch"
          placeholder="Начните вводить"
          @select="handleSelect"
        >
          <i class="el-icon-search el-input__icon" slot="suffix" />
          <template slot-scope="{ item }">
            <div v-if="item.fio">{{ item.fio }}</div>
            <div v-else>Поиск не дал результатов</div>
          </template>
        </el-autocomplete>
        <Button
          type="primary"
          :label="createBtnLabel"
          width="300"
          @click="isShowCreatePopup = true"
        />
        <el-dialog title="Создание пользователя" :visible.sync="isShowCreatePopup">
          <div clas="flex">
            <div class="input">
              <p class="hint-text mb-8">ФИО</p>
              <el-input placeholder="ФИО" v-model="creating.fio" />
            </div>
            <div class="input">
              <p class="hint-text mb-8">Логин</p>
              <el-input placeholder="Логин" v-model="creating.login" />
            </div>
          </div>
          <div class="input">
            <p class="hint-text mb-8">Пароль</p>
            <el-input placeholder="Пароль" v-model="creating.password" />
          </div>
          <div class="input">
            <p class="hint-text mb-8">Группа</p>
            <el-input placeholder="Группа" v-model="creating.group" />
          </div>
          <div class="input">
            <p class="hint-text mb-8">Телефон</p>
            <el-input placeholder="Телефон" v-model="creating.phone" />
          </div>
          <div class="input">
            <p class="hint-text mb-8">Почта</p>
            <el-input placeholder="Почта" v-model="creating.email" />
          </div>
          <div class="input">
            <p class="hint-text mb-8">Роль</p>
            <el-select v-model="creating.role" placeholder="Роли">
              <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id"></el-option>
            </el-select>
          </div>
          <div slot="footer" class="btn-footer">
            <Button
              type="reject"
              label="Отменить"
              width="150"
              class="mr-24"
              @click="isShowCreatePopup = false"
            />
            <Button type="primary" label="Создать" width="150" @click="createUser" />
          </div>
        </el-dialog>
      </div>
      <el-table
        :data="tableData.filter(data=> !autocompleteValue || !data.fio || data.fio.toLowerCase().includes(autocompleteValue.toLowerCase()))"
        empty-text="Нет данных"
      >
        <el-table-column prop="fio" label="ФИО" />
        <el-table-column prop="login" label="Логин" />
        <el-table-column prop="faculty" label="Факультет" />
        <el-table-column prop="group" label="Группа" />
        <el-table-column prop="phone" label="Телефон" />
        <el-table-column prop="email" label="Почта" />
        <el-table-column width="50px">
          <template slot-scope="scope">
            <i
              v-if="scope.row.login !== 'admin'"
              @click="isShowDeletePopup = true; delete_row = scope.row"
              class="el-icon-delete"
            />
          </template>
        </el-table-column>
        <el-table-column width="50px">
          <template slot-scope="scope">
            <i @click="updateUser(scope.row)" class="el-icon-edit" />
            <el-dialog
              title="Хотите удалить пользователя"
              :visible.sync="isShowDeletePopup"
              width="550px"
            >
              <p>Вы уверены, что хотите удалить пользователя?</p>
              <div slot="footer" class="btn-footer">
                <Button
                  type="reject"
                  label="Отменить"
                  width="150"
                  class="mr-24"
                  @click="isShowDeletePopup = false"
                />
                <Button type="primary" label="Да, удалить" width="150" @click="deleteUser" />
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Button from "@/components/ui/Button/Button";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Button
  },
  props: {
    tableData: { type: Array }
  },
  data() {
    return {
      isShowDeletePopup: false,
      isShowCreatePopup: false,
      autocompleteValue: "",
      id: -1,
      filter: [{ text: "asd", value: "asd" }],
      creating: {},
      roles: [],
      delete_row: {}
    };
  },
  computed: {
    ...mapState("user", ["profile"]),
    createBtnLabel() {
      return "Создать пользователя";
    }
  },
  methods: {
    ...mapActions("tasks", ["EXCEL"]),
    ...mapActions("user", [
      "GET_ROLES",
      "CREATE_USER",
      "GET_USERS",
      "DELETE_USER"
    ]),
    async createUser() {
      try {
        await this.CREATE_USER({
          fio: this.creating.fio,
          login: this.creating.login,
          password: this.creating.password,
          phone: this.creating.phone,
          email: this.creating.email,
          faculty: "ИУ9",
          group: this.creating.group,
          roles: [{ id: this.creating.role }]
        });
        this.creating = {};
        this.isShowCreatePopup = false;
        this.$emit("update-table");
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    async deleteUser() {
      try {
        await this.DELETE_USER(this.delete_row.id);
        this.isShowDeletePopup = false;
        this.$emit("update-table");
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    updateUser(row) {
      this.$router.push({
        name: "change-user",
        params: {
          id: row.id
        }
      });
    },
    querySearch(value, callback) {
      try {
        // const results = await this.SEARCH_STUDENTS({ fio: value })
        // if (Array.isArray(results)) callback(results);
        const regex = new RegExp(".*" + this.autocompleteValue + ".*", "g");
        callback(
          this.tableData.filter(elem => {
            if (!elem.fio) return;
            elem.fio.match(regex);
          })
        );
      } catch (e) {
        console.log(e);
        callback([{}]);
      }
    },
    handleSelect(item) {
      this.autocompleteValue = item.fio;
      this.filter = [item.fio];
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  },
  async mounted() {
    try {
      const result = await this.GET_ROLES();
      this.roles = result;
    } catch (e) {
      this.$notify.error({
        title: "Ошибка!",
        message: "Что-то пошло не так"
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.task-input {
  width: 100%;
  max-width: 300px;
}
.article {
  background: var(--white);
  padding: 24px;
}
.autocomplete {
  width: 100%;
  max-width: 400px;
}
.excel {
  float: right;
  margin-right: 10px;
  margin-top: 15px;
}
.el-select .el-input {
  width: 110px;
}
.input-with-select .el-input-group__prepend {
  background-color: #fff;
}
.input {
  margin-top: 10px;
}
.create_popup {
  display: flex;
  flex-direction: column;
}
.flex {
  display: flex;
}
</style>
