<template>
  <main class="page">
    <div class="page-head">
      <h1 class="title">{{ pageTitle }}</h1>
      <div class="page-head-div">
        <div class="task-type">{{ taskType }}</div>
      </div>
    </div>
    <div style="padding: 10px;">
      <div class="points">
        <div v-for="point in taskData.points" :key="point.description">
          <p>{{ point.name }}. {{ point.description }}</p>
          <div style="padding-left: 15px; padding-top: 10px; padding-bottom: 10px;">
            <div v-for="v in point.vars" :key="v.name" style="margin-top: 3px;">
              <p>{{ v.name }}. {{ v.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-if="isTeacher" style="font-weight: bold;">Варианты:</p>
    <p v-else style="font-weight: bold;">Вариант:</p>
    <div style="padding: 10px;">
      <div class="points">
        <el-table
          :data="taskData.variants"
          :default-sort="{prop: 'number', order: 'ascending'}"
          style="width: 100%"
          border
        >
          <el-table-column prop="number" label="Номер" width="100px"></el-table-column>
          <el-table-column v-for="p in taskData.params" :key="p" :label="p" :prop="p"></el-table-column>
          <!-- <el-table-column width="40px"> <i class="el-icon-info" /></el-table-column> -->
        </el-table>
      </div>
      <div style="display:flex; margin-top:10px; justify-content:flex-end;" v-if="isTeacher">
        <Button
          type="simple"
          label="Добавить пользователя"
          width="200"
          style="height:30px;"
          @click="isShowCreatePopup = true"
        />
        <Button
          type="simple"
          label="Добавить группу"
          width="200"
          style="margin-left: 20px; height:30px;"
          @click="isShowAddGroupPopup = true"
        />
      </div>
      <el-table
        :data="taskData.users"
        :default-sort="{prop: 'fio', order: 'ascending'}"
        style="width: 100%"
        v-if="isTeacher"
      >
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="fio" label="ФИО"></el-table-column>
        <el-table-column label="Вариант" fixed="right" width="250px">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.variant.number"
              placeholder="Выберите"
              @change="value => selectVariant(value, scope.row)"
              style="margin-top: 15px;"
            >
              <el-option
                v-for="v in taskData.variants"
                :key="v.id"
                :label="v.number"
                :value="v.number"
              ></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="100px">
          <template slot-scope="scope">
            <i
              @click="deleteUser(scope.row)"
              class="el-icon-delete"
              style="margin-left:50%; margin-top:10px;"
            />
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="100px">
          <i class="el-icon-chat-line-round" style="margin-left:50%; margin-top:10px;" />
        </el-table-column>
        <el-table-column fixed="right" width="150px">
          <template slot-scope="scope">
            <Button
              type="custom"
              label="Скачать отчет"
              width="200px"
              @click="downloadReport(scope.row)"
              style="height:30px; margin-top:5px;"
              v-if="scope.row.completed"
            />
          </template>
        </el-table-column>
      </el-table>
      <Button
        type="simple"
        label="Подтвердить"
        width="150"
        @click="submit"
        style="height:30px; margin-top: 15px; margin-left:auto;"
        v-if="isTeacher"
      />
      <div v-else style="margin-left: -10px;">
        <h4 style="margin-top: 30px;">Отчет</h4>
        <div style="display:flex;">
          <el-upload
            class="upload-demo mr-24"
            :limit="1"
            :on-exceed="handleExceed"
            :auto-upload="false"
            :on-change="handleSuccessFile"
            :on-remove="handleRemove"
            action
          >
            <Button
              slot="trigger"
              type="simple"
              label="Выбрать"
              class="down"
              width="150"
              style="margin-top:15px;"
            />
          </el-upload>
          <Button
            slot="trigger"
            type="simple"
            label="Отправить"
            class="down"
            width="150"
            @click="upload"
            style="margin-left:15px;margin-top:15px;"
          />
        </div>
      </div>
    </div>
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

    <el-dialog title="Добавление группы" :visible.sync="isShowAddGroupPopup" width="750px">
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
  </main>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Button from "@/components/ui/Button/Button";
import store from "@/store/store";

export default {
  components: {
    Button
  },
  data() {
    return {
      taskData: { users: [] },
      type: "labs",
      isShowCreatePopup: false,
      isShowAddGroupPopup: false,
      autocompleteValue: "",
      popupUser: {},
      popupGroup: {},
      otherGroups: [],
      users: [],
      doc_name: "",
      doc_raw: ""
    };
  },
  computed: {
    ...mapState("user", ["profile"]),
    ...mapState("auth", ["token"]),
    pageTitle() {
      return (
        "Лабораторная работа №" +
        " " +
        this.taskData.number +
        ' "' +
        this.taskData.name +
        '"'
      );
    },
    taskType() {
      switch (this.type) {
        case "labs":
          return "Лабораторная работа";
        case "courses":
          return "Курсовая работа";
      }
      return "";
    },
    getActive() {
      return this.$route.name;
    },
    isAdmin() {
      return !!store.getters["user/isAdmin"];
    },
    isNewsEditor() {
      return !!store.getters["user/isNewsEditor"];
    },
    isTeacher() {
      return !!store.getters["user/isTeacher"];
    },
    variant() {
      var i;
      for (i = 0; i < this.taskData.users.length; i++) {
        if (this.taskData.users[i].login == store.getters["user/login"]) {
          return this.taskData.users[i].variant.number;
        }
      }
      return "-";
    },
    variant_id() {
      var i;
      for (i = 0; i < this.taskData.users.length; i++) {
        if (this.taskData.users[i].login == store.getters["user/login"]) {
          return this.taskData.users[i].variant.id;
        }
      }
      return "-";
    }
  },
  methods: {
    ...mapActions("tasks", [
      "CHANGE_TASK",
      "CREATE_TASK",
      "SEARCH_STUDENTS",
      "GET_TASK",
      "UPLOAD",
      "DOWNLOAD_REPORT",
      "GET_DISCIPLINES",
      "DELETE_USER"
    ]),
    ...mapActions("user", ["FIND_USERS", "GET_GROUPS_MY"]),
    ...mapActions("chat", ["CREATE_CHAT"]),

    uploadFile() {
      this.$refs.upload.submit();
    },
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async querySearch(value, callback) {
      try {
        const result = await Promise.resolve(
          this.FIND_USERS({
            fio: value,
            role_filter: "student"
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
    handleSelect() {},
    deleteUser(row) {
      this.taskData.users = this.taskData.users.filter(
        elem => elem.id != row.id
      );
    },
    handleDropDownSelect() {},
    async createTask() {},
    addAttachment(file) {
      try {
        this.UPLOAD({ file: file, id: this.taskData.id });
        this.taskData.completed = true;
        this.$notify({
          title: "Успешно!",
          message: "Файл загружен"
        });
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    submitFile() {
      this.UPLOAD(this.file);
    },
    forceFileDownload(response, filename) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    },
    async downloadReport(row) {
      try {
        const resp = await this.DOWNLOAD_REPORT({lab_id: this.taskData.id, user_id: row.id});
        this.forceFileDownload(resp, resp.filename);
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    tableRowClassName({ row, rowIndex }) {
      rowIndex == "kek";
      if (row.completed) {
        return "success-row";
      } else {
        return "common-row";
      }
    },
    async create_chat() {},
    async findUsers(value, callback) {
      try {
        const result = await Promise.resolve(
          this.FIND_USERS({
            fio: value,
            role_filter: "student"
          })
        );

        callback(
          result.filter(elem => {
            var i;
            for (i = 0; i < this.taskData.users.length; i++) {
              if (elem.id === this.taskData.users[i].id) {
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
    handleSearch(item) {
      this.popupUser = item;
    },
    async submit() {
      try {
        await this.CHANGE_TASK({
          taskData: this.taskData,
          id: this.taskData.id
        });
        this.$notify({
          title: "Успешно!",
          message: "Изменения успешно применены"
        });
      } catch {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    async addUser() {
      this.popupUser.variant = {};
      this.taskData.users.push(JSON.parse(JSON.stringify(this.popupUser)));
      this.popupUser = {};
      this.popupGroup = {};
      this.isShowCreatePopup = false;
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
    selectVariant(value, row) {
      var i, j;
      for (i = 0; i < this.taskData.variants.length; i++) {
        if (this.taskData.variants[i].number === value) {
          j = i;
        }
      }
      this.taskData.users.forEach(elem => {
        if (elem.id != row.id) {
          return;
        }
        elem.variant = JSON.parse(JSON.stringify(this.taskData.variants[j]));
      });
    },
    async addGroup() {
      try {
        var g = JSON.parse(JSON.stringify(this.popupGroup));
        g.users.forEach(elem => (elem.variant = {}));
        this.taskData.users.push(...g.users);
        this.popupUser = {};
        this.popupGroup = {};
        this.isShowAddGroupPopup = false;
        const groups = await this.GET_GROUPS_MY({ filter: "student" });
        this.otherGroups = groups;
        this.otherGroups.forEach(elem => {
          elem.users = elem.users.filter(e => {
            var i;
            for (i = 0; i < this.taskData.users.length; i++) {
              if (e.id === this.taskData.users[i].id) {
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
    },
    handleSuccessFile(file) {
      this.doc_name = file.name;
      this.doc_raw = file.raw;
    },
    handleExceed() {
      this.$message.error({
        title: "Ошибка",
        message: "Чтобы прикрепил файл, удалите первый."
      });
    },
    handleRemove() {
      this.image_bytes = undefined;
    },
    async upload() {
      try {
        await this.UPLOAD({
          file: this.doc_raw,
          data: {
            doc_name: this.doc_name
          },
          variant_id: this.variant_id
        });
        this.$notify({
          title: "Успешно!",
          message: "Отчет успешно загружен"
        })
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    }
  },
  async mounted() {
    try {
      const result = await this.GET_TASK({
        id: this.$route.params.id
      });
      this.taskData = result;
      var s = new Set();
      this.taskData.variants.forEach(v => {
        v.params.forEach(p => {
          s.add(p.title);
        });
      });
      this.taskData.params = [...s];
      const groups = await this.GET_GROUPS_MY({ filter: "student" });
      this.otherGroups = groups;
      this.otherGroups.forEach(elem => {
        elem.users = elem.users.filter(e => {
          var i;
          for (i = 0; i < this.taskData.users.length; i++) {
            if (e.id === this.taskData.users[i].id) {
              return false;
            }
          }
          return true;
        });
      });
      try {
        this.taskData.variants.forEach(elem => {
          this.taskData.params.forEach(pr => {
            var i;
            for (i = 0; i < elem.params.length; i++) {
              if (elem.params[i].title == pr) {
                elem[pr] = elem.params[i].value;
                return;
              }
            }
            elem[pr] = "-";
          });
        });
      } catch (e) {
        console.log(e);
      }
      if (!this.isTeacher) {
        this.taskData.variants = this.taskData.variants.filter(
          elem => elem.number === this.variant
        );
      }
    } catch (e) {
      this.$notify.error({
        title: "Ошибка!",
        message: "Что-то пошло не так"
      });
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  padding-top: 30px;
  width: 80%;
}
.title {
  max-width: 80%;
}
.page-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.page-head-div {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.task-type {
  width: fit-content;
  padding: 8px 12px;
  margin-right: 8px;
  border-radius: 24px;
  background: #9b9b9b;
  color: var(--white);
}
.points {
  margin-top: 10px;
  font-weight: 400;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 23pt;
}
.user_row {
  display: flex;
  font-weight: 700;
  margin-top: 7px;
  font-size: 20pt;
}
.down {
  height: 35px;
}
</style>

<style>
.el-table .common-row {
}

.el-table .success-row {
  background: #c2eeaa;
}
</style>
