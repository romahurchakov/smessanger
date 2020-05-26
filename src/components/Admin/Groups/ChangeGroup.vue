<template>
  <div class="page">
    <div>
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
            <div v-if="item.name">{{ item.name }}</div>
            <div v-else>Поиск не дал результатов</div>
          </template>
        </el-autocomplete>
        <Button
          type="primary"
          :label="createBtnLabel"
          width="300"
          @click="isShowCreatePopup = true"
        />
        <el-dialog title="Добавление пользователя в группу" :visible.sync="isShowCreatePopup">
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
          <div v-if="popupUser" class="popup_user">
            <div v-if="popupUser">
              <div class="mb-24">
                <p class="hint-text mb-8">ФИО</p>
                <p class="text-style">{{ popupUser.fio || '-'}}</p>
              </div>
              <div class="mb-24">
                <p class="hint-text mb-8">Логин</p>
                <p class="text-style">{{ popupUser.login || '-'}}</p>
              </div>
            </div>
            <div v-if="popupUser">
              <div class="mb-24">
                <p class="hint-text mb-8">Факультет</p>
                <p class="text-style">{{ popupUser.faculty|| '-' }}</p>
              </div>
              <div class="mb-24">
                <p class="hint-text mb-8">Группа</p>
                <p class="text-style">{{ popupUser.group || '-'}}</p>
              </div>
            </div>
            <div v-if="popupUser">
              <div class="mb-24">
                <p class="hint-text mb-8">Телефон</p>
                <p class="text-style">{{ popupUser.phone || '-'}}</p>
              </div>
              <div class="mb-24">
                <p class="hint-text mb-8">Почта</p>
                <p class="text-style">{{ popupUser.email || '-'}}</p>
              </div>
            </div>
          </div>
          <div slot="footer" class="btn-footer">
            <Button
              type="reject"
              label="Отменить"
              width="150"
              class="mr-24"
              @click="isShowCreatePopup = false"
            />
            <Button type="primary" label="Добавить" width="150" @click="addUser" />
          </div>
        </el-dialog>
      </div>
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
import Button from "@/components/ui/Button/Button";
import { mapActions } from "vuex";
export default {
  components: {
    Button
  },
  data() {
    return {
      isShowDeletePopup: false,
      isShowCreatePopup: false,
      autocompleteValue: "",
      popupUser: {},
      id: -1,
      filter: [{ text: "asd", value: "asd" }],
      creating: {},
      group: {users:[]}
    };
  },
  computed: {
    createBtnLabel() {
      return "Добавить пользователя в группу";
    }
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
  async mounted() {
    try {
      const res = await this.GET_GROUP(this.$route.params.id);
      this.group = res;
    } catch (err) {
      this.$notify.error({
        title: "Ошибка!",
        message: err.message
      });
    }
  }
};
</script>

<style>
.page {
  width: 50%;
  padding-top: 40px;
}
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
.popup_user {
  margin-top: 24px;
}
</style>
