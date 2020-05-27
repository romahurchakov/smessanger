<template>
  <div class="page">
    <div class="header"></div>
    <div class="body">
      <p class="hint-text mb-8">Введите название задания</p>
      <el-input placeholder="Введите название" v-model="name" />
      <el-autocomplete
        class="task__input autocomplete"
        v-model="autocompleteValue"
        :trigger-on-focus="false"
        :fetch-suggestions="findUsers"
        placeholder="Введите ФИО"
        @select="handleSearch"
      >
        <i class="el-icon-search el-input__icon" slot="suffix" />
        <template slot-scope="{ item }">
          <div v-if="item.fio">{{ item.fio }}</div>
          <div v-else>Поиск не дал результатов</div>
        </template>
      </el-autocomplete>
      <el-table
        :data="group.users.filter(data=> !autocompleteValue || !data.fio || data.fio.toLowerCase().includes(autocompleteValue.toLowerCase()))"
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
            <i @click="isShowDeletePopup = true; id = scope.$index" class="el-icon-delete" />
          </template>
        </el-table-column>
        <el-table-column width="50px">
          <template slot-scope="scope">
            <el-dialog
              title="Хотите удалить задание"
              :visible.sync="isShowDeletePopup"
              width="550px"
            >
              <p>Вы уверены, что хотите удалить пользователя из группы ?</p>
              <div slot="footer" class="btn-footer">
                <Button
                  type="reject"
                  label="Отменить"
                  width="150"
                  class="mr-24"
                  @click="isShowDeletePopup = false"
                />
                <Button
                  type="primary"
                  label="Да, удалить"
                  width="150"
                  @click="deleteUser(group.users[scope.$index])"
                />
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data() {
    return {
      isShowDeletePopup: false,
      isShowCreatePopup: false,
      autocompleteValue: "",
      popupUser: {},
      id: -1,
      filter: [{ text: "asd", value: "asd" }],
      creating: {},
      group: { users: [] },
      name: ""
    };
  },
  methods: {
    ...mapActions("user", ["GET_GROUP", "FIND_USERS", "UPDATE_GROUP"]),

    async addUser() {
      this.group.users.push(this.popupUser);
      this.group.users = [...new Set(this.group.users)];
      this.popupUser = {};
      try {
        const res = await this.UPDATE_GROUP({
          id: this.group.id,
          data: this.group
        });
        this.group = res;
        this.popupUser = {};
        this.isShowCreatePopup = false;
      } catch (err) {
        this.$notify.error({
          title: "Ошибка!",
          message: err.message
        });
      }
    },
    async deleteUser(item) {
      this.group.users = this.group.users.filter(elem => elem.id != item.id);
      try {
        const res = await this.UPDATE_GROUP({
          id: this.group.id,
          data: this.group
        });
        this.group = res;
      } catch (err) {
        this.$notify.error({
          title: "Ошибка!",
          message: err.message
        });
      }
    },
    querySearch(value, callback) {
      try {
        const regex = new RegExp(".*" + this.autocompleteValue + ".*", "g");
        callback(
          this.group.users.filter(elem => {
            if (!elem.name) return;
            elem.name.match(regex);
          })
        );
      } catch (e) {
        console.log(e);
        callback([{}]);
      }
    },
    async findUsers(value, callback) {
      try {
        const result = await Promise.resolve(
          this.FIND_USERS({
            fio: value,
            role_filter: ""
          })
        );
        callback(result);
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    handleSelect(item) {
      this.autocompleteValue = item.name;
      this.filter = [item.name];
    },
    handleSearch(item) {
      console.log(item);
      this.popupUser = item;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  },
  async mounted() {}
};
</script>

<style lang="scss" scoped>
.page {
  height: 100%;

  &__header {
  }

  &__body {
  }
}
</style>