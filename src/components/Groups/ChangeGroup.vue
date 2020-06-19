<template>
  <div class="page">
    <div class="page-head mb-40">
      <h1 class="title">{{ group.name }}</h1>
    </div>
    <div>
      <div class="fl mb-24">
        <el-autocomplete
          class="autocomplete mr-24"
          v-model="autocompleteValue"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearch"
          placeholder="Поиск студентов"
          @select="handleSelect"
        >
          <i class="el-icon-search el-input__icon" slot="suffix" />
          <template slot-scope="{ item }">
            <div v-if="item.name">{{ item.name }}</div>
            <div v-else>Поиск не дал результатов</div>
          </template>
        </el-autocomplete>
        <Button
          type="simple"
          :label="createBtnLabel"
          width="200"
          @click="isShowCreatePopup = true"
        />
        <Button
          type="simple"
          label="Добавить группу"
          width="200"
          style="margin-left: 20px"
          @click="isShowAddGroupPopup = true"
        />
        <el-dialog title="Добавление пользователя" :visible.sync="isShowCreatePopup">
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
              type="simple"
              label="Отменить"
              width="150"
              class="mr-24"
              @click="isShowCreatePopup = false"
            />
            <Button type="simple" label="Добавить" width="150" @click="addUser" />
          </div>
        </el-dialog>

        <el-dialog title="Добавление группы" :visible.sync="isShowAddGroupPopup" width="700px">
          <div style="display:flex;">
            <div>
              <p style="font-weight: bold;">Выберите группу:</p>
              <el-select
                v-model="popupGroup.name"
                filterable
                placeholder="Выберите группу"
                @change="selectGroup"
                style="margin-top: 15px;"
              >
                <el-option
                  v-for="g in otherGroups"
                  :key="g.id"
                  :label="g.name + ' (' + g.users.length + ')' "
                  :value="g.name"
                ></el-option>
              </el-select>
            </div>
            <div style="margin-left: 100px;">
              <p style="font-weight: bold;">Список пользователей:</p>
              <div v-for="(user, index) in popupGroup.users" :key="user.id" class="user_row">
                <p>{{ index+1 }}.</p>
                <p style="margin-left:10px;">{{ user.fio }}</p>
              </div>
            </div>
          </div>
          <div slot="footer" class="btn-footer">
            <Button
              type="simple"
              label="Отменить"
              width="150"
              class="mr-24"
              @click="isShowAddGroupPopup = false"
            />
            <Button type="simple" label="Добавить" width="150" @click="addGroup" />
          </div>
        </el-dialog>
      </div>
      <el-table
        :data="group.users.filter(data=> !autocompleteValue || !data.fio || data.fio.toLowerCase().includes(autocompleteValue.toLowerCase()))"
        empty-text="Нет данных"
        default-expand-all
        row-key="id"
      >
        <el-table-column prop="fio" label="ФИО" />
        <el-table-column prop="login" label="Логин" />
        <el-table-column prop="faculty" label="Факультет" />
        <el-table-column prop="group" label="Группа" />
        <el-table-column prop="phone" label="Телефон" />
        <el-table-column prop="email" label="Почта" />
        <el-table-column width="50px">
          <template slot-scope="scope">
            <i @click="isShowDeletePopup = true; to_delete = scope.row" class="el-icon-delete" />
          </template>
        </el-table-column>
        <el-table-column width="50px">
          <template>
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
import { mapActions } from "vuex";
export default {
  components: {
    Button
  },
  data() {
    return {
      isShowDeletePopup: false,
      isShowCreatePopup: false,
      isShowAddGroupPopup: false,
      autocompleteValue: "",
      popupUser: {},
      popupGroup: {},
      id: -1,
      filter: [{ text: "asd", value: "asd" }],
      creating: {},
      group: { users: [] },
      otherGroups: []
    };
  },
  computed: {
    createBtnLabel() {
      return "Добавить пользователя";
    }
  },
  methods: {
    ...mapActions("user", [
      "GET_GROUP",
      "FIND_USERS",
      "UPDATE_GROUP",
      "GET_GROUPS_MY"
    ]),

    async addUser() {
      this.group.users.push(this.popupUser);
      this.group.users = [...new Set(this.group.users)];
      this.popupUser = {};
      this.popupGroup = {};
      try {
        const res = await this.UPDATE_GROUP({
          id: this.group.id,
          data: this.group
        });
        this.group = res;
        this.popupUser = {};
        const groups = await this.GET_GROUPS_MY({filter:""});
        this.otherGroups = groups.filter(
          elem => elem.id != this.$route.params.id
        );
        this.otherGroups.forEach(elem => {
          elem.users = elem.users.filter(e => {
            var i;
            for (i = 0; i < this.group.users.length; i++) {
              if (e.id === this.group.users[i].id) {
                return false;
              }
            }
            return true;
          });
        });
        this.isShowCreatePopup = false;
      } catch (err) {
        this.$notify.error({
          title: "Ошибка!",
          message: err.message
        });
      }
    },
    async deleteUser() {
      try {
        this.group.users = this.group.users.filter(
          elem => elem.id != this.to_delete.id
        );
        const res = await this.UPDATE_GROUP({
          id: this.group.id,
          data: this.group
        });
        this.group = res;
        const groups = await this.GET_GROUPS_MY({filter:""});
        this.otherGroups = groups.filter(
          elem => elem.id != this.$route.params.id
        );
        this.otherGroups.forEach(elem => {
          elem.users = elem.users.filter(e => {
            var i;
            for (i = 0; i < this.group.users.length; i++) {
              if (e.id === this.group.users[i].id) {
                return false;
              }
            }
            return true;
          });
        });
        this.isShowDeletePopup = false;
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

        callback(
          result.filter(elem => {
            var i;
            for (i = 0; i < this.group.users.length; i++) {
              if (elem.id === this.group.users[i].id) {
                return false;
              }
            }
            return true;
          })
        );
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
    },
    selectGroup(value) {
      var i;
      for (i = 0; i < this.otherGroups.length; i++) {
        if (this.otherGroups[i].name == value) {
          this.popupGroup = JSON.parse(JSON.stringify(this.otherGroups[i]));
          return;
        }
      }
    },
    async addGroup() {
      try {
        this.popupGroup.users.forEach(elem => (elem.from = this.popupGroup.id));
        this.group.users.push(...this.popupGroup.users);
        const res = await this.UPDATE_GROUP({
          id: this.group.id,
          data: this.group
        });
        this.group = res;
        this.popupUser = {};
        this.popupGroup = {};
        this.isShowAddGroupPopup = false;
        const groups = await this.GET_GROUPS_MY({filter:""});
        this.otherGroups = groups.filter(
          elem => elem.id != this.$route.params.id
        );
        this.otherGroups.forEach(elem => {
          elem.users = elem.users.filter(e => {
            var i;
            for (i = 0; i < this.group.users.length; i++) {
              if (e.id === this.group.users[i].id) {
                return false;
              }
            }
            return true;
          });
        });
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
      const res = await this.GET_GROUP(this.$route.params.id);
      this.group = res;
      const groups = await this.GET_GROUPS_MY({filter:""});
      this.otherGroups = groups.filter(
        elem => elem.id != this.$route.params.id
      );
      this.otherGroups.forEach(elem => {
        elem.users = elem.users.filter(e => {
          var i;
          for (i = 0; i < this.group.users.length; i++) {
            if (e.id === this.group.users[i].id) {
              return false;
            }
          }
          return true;
        });
      });
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
.page {
  width: 80%;
  padding-top: 40px;
}
.page-head {
  display: flex;
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

.user_row {
  display: flex;
  font-weight: 700;
  margin-top: 7px;
  font-size: 20pt;
}
</style>
