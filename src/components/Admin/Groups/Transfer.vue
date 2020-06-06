<template>
  <div class="page">
    <div class="page__header">
      <h1>Фомирование учебной группы "{{ group.name }}"</h1>
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
    </div>
    <div class="page__body">
      <div class="page__body__left">
        <div style="display:flex; justify-content: space-between;">
          <h2>Старый состав группы</h2>
          <Button
            type="simple"
            label="Добавить пользователя"
            width="200"
            style="height:30px;"
            @click="isShowCreatePopup = true"
          />
        </div>
        <el-table
          :data="group.users"
          empty-text="Нет данных"
          type="index"
          :row-class-name="tableRowClassName"
          :default-sort="{prop: 'fio', order: 'ascending'}"
        >
          <el-table-column type="index" />
          <el-table-column prop="fio" label="ФИО" sortable />
          <el-table-column prop="login" label="Логин" />
          <el-table-column width="40px">
            <template slot-scope="scope">
              <i v-if="scope.row.active" class="el-icon-view" @click="unactive(scope.row)" />
              <i v-else class="el-icon-video-play" @click="active(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="page__body__right">
        <div style="display:flex; justify-content: space-between;">
          <h2>Новый состав группы</h2>
          <div style="display:flex; align-items:center;">
          <p style="font-weight: 900;font-family: Arial, Helvetica, sans-serif;"> Новое название группы: </p>
          <el-input placeholder="Please input" v-model="new_group.name" style="width:150px; margin-left:10px;"></el-input>
          </div>
        </div>
        <el-table
          :data="new_group.users"
          empty-text="Нет данных"
          :default-sort="{prop: 'fio', order: 'ascending'}"
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="index" />
          <el-table-column prop="fio" label="ФИО" sortable />
          <el-table-column prop="login" label="Логин" />
          <el-table-column width="40px">
            <template slot-scope="scope">
              <i v-if="scope.row.new" class="el-icon-view" @click="newRemove(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="page__footer">
      <Button
        type="simple"
        label="Подтвердить"
        width="200"
        style="height:40px; margin-left: auto;"
        @click="approve"
      />
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
      group: { users: [] },
      new_group: { users: [] },
      isShowCreatePopup: false,
      autocompleteValue: "",
      popupUser: {}
    };
  },
  computed: {},
  methods: {
    ...mapActions("user", ["GET_GROUP", "FIND_USERS", "UPDATE_GROUP"]),
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
      this.popupUser = item;
      this.popupUser.new = true;
      this.popupUser.active = true;
    },
    tableRowClassName({ row }) {
      if (!row.active) {
        return "warning-row";
      } else if (row.new) {
        return "success-row";
      }
      return "";
    },
    async addUser() {
      this.new_group.users.push({ ...this.popupUser });
      this.new_group.users = [...new Set(this.new_group.users)];
      this.isShowCreatePopup = false;
      this.popupUser = {};
    },
    unactive(row) {
      this.new_group.users = this.new_group.users.filter(
        elem => elem.login != row.login
      );
      this.group.users.forEach(elem => {
        if (elem.login == row.login) {
          elem.active = false;
        }
      });
    },
    active(row) {
      this.new_group.users.push(row);
      this.group.users.forEach(elem => {
        if (elem.login == row.login) {
          elem.active = true;
        }
      });
    },
    newRemove(row) {
      this.new_group.users = this.new_group.users.filter(
        elem => elem.login != row.login
      );
    },
    async approve() {
      try {
        const res = await this.UPDATE_GROUP({
          id: this.group.id,
          data: this.new_group
        });
        res.users.forEach(element => {
          element.active = true;
        });
        this.group = res;
        this.new_group = JSON.parse(JSON.stringify(res));
        this.$notify({
          title: "Успешно!",
          message: "Состав группы утвержден"
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
      res.users.forEach(element => {
        element.active = true;
      });
      this.group = res;
      this.new_group = JSON.parse(JSON.stringify(res));
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

  &__header {
  }

  &__body {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
    &__left {
      width: 40%;
    }

    &__right {
      width: 40%;
    }
  }

  &__footer {
    margin-top: 20px;
  }
}
</style>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .warning-row:hover {
  background: oldlace;
}

.el-table .success-row {
  background: #7fff3abd;
}
</style>