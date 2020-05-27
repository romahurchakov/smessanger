<template>
  <main class="page">
    <div class="page-head mb-40">
      <h1 class="title">{{ pageTitle }}</h1>
      <div class="page-head-div">
        <div class="task-type">{{ taskType }}</div>
      </div>
    </div>
    <section class="task mb-40">
      <div class="task__info mb-24">
        <div class="flex">
          <div class="task__input rigt-auto" v-if="!readOnly">
            <p class="hint-text mb-8">Введите название задания</p>
            <el-input placeholder="Введите название" v-model="newTaskData.title" />
          </div>
          <div class="mr20">
            <p class="hint-text mb-8">Дисциплина</p>
            <p v-if="readOnly">{{ taskData.discipline }}</p>
            <el-select v-else v-model="newTaskData.discipline" placeholder="Укажите вашу роль">
              <el-option
                v-for="discipline in disciplines"
                :key="discipline.id"
                :label="discipline.name"
                :value="discipline.name"
              ></el-option>
            </el-select>
          </div>
          <div class="task__input">
            <p class="hint-text mb-8">Крайний срок сдачи</p>
            <p v-if="readOnly">{{ taskData.thesisDate }}</p>
            <el-date-picker
              v-if="profile.role.teacher"
              v-model="newTaskData.thesisDate"
              popper-class="date"
              :picker-options="datePickerOptions"
              class="calendar"
              value-format="yyyy.MM.dd"
              format="d MMM yyyy г."
              type="date"
              placeholder="Выберите день"
            />
          </div>
        </div>
        <div class="mb-24">
          <p class="hint-text mb-8 mgt">Описание задания</p>
          <p v-if="readOnly" class="text-style">{{ taskData.description || '-' }}</p>
          <textarea v-else v-model="newTaskData.description" class="task__desc" />
        </div>
        <div class="task__input mgt" v-if="!readOnly">
          <p class="hint-text mb-8">Поиск студента по ФИО</p>
          <p v-if="readOnly">{{ taskData.fio }}</p>
          <el-autocomplete
            v-else
            class="task__input autocomplete"
            v-model="autocompleteValue"
            :trigger-on-focus="false"
            :fetch-suggestions="querySearch"
            placeholder="Введите ФИО"
            @select="handleSelect"
          >
            <i class="el-icon-search el-input__icon" slot="suffix" />
            <template slot-scope="{ item }">
              <div v-if="item.fio">{{ item.fio }}</div>
              <div v-else>Поиск не дал результатов</div>
            </template>
          </el-autocomplete>
        </div>
      </div>
      <div class="task__info">
        <el-table
          :data="readOnly ? taskData.users : newTaskData.users"
          empty-text="Нет данных"
          :row-class-name="tableRowClassName"
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
                <p>Вы уверены, что хотите удалить пользователя?</p>
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
                    @click="readOnly? deleteUser(taskData.users[scope.$index].id): deleteUser(newTaskData.users[scope.$index].id)"
                  />
                </div>
              </el-dialog>
            </template>
          </el-table-column>
          <el-table-column v-if="readOnly">
            <template slot-scope="scope">
              <div
                v-if="readOnly? taskData.users[scope.$index].completed && profile.role.teacher: false"
              >
                <Button label="Скачать" type="info" @click="downloadReport(scope)">
                  <i src="@/assets/icons/download.svg" width="24" height="24" />
                </Button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </section>
    <div v-if="profile.role.teacher && !createChat && readOnly">
      <Button
        slot="trigger"
        type="info"
        label="Создать чат"
        width="170"
        style="margin-left: auto; color: black;"
        @click="showChatCreation = true"
      />
      <el-dialog title="Создание чата" :visible.sync="showChatCreation" width="550px">
        <p>Создать чат со всеми студентами, на которых назначена работа ?</p>
        <div slot="footer" class="btn-footer">
          <Button
            type="reject"
            label="Отменить"
            width="150"
            class="mr-24"
            @click="showChatCreation = false"
          />
          <Button
            type="primary"
            label="Да, создать"
            width="150"
            @click="create_chat"
          />
        </div>
      </el-dialog>
    </div>
    <div class="actions">
      <el-upload
        v-if="profile.role.student"
        class="upload-demo mr-24"
        ref="upload"
        :http-request="addAttachment"
        :auto-upload="false"
        with-credentials
        multiple
      >
        <Button slot="trigger" type="info" label="Выбрать файл" width="170" />
      </el-upload>
      <Button
        v-if="profile.role.student"
        type="primary"
        label="Отправить файл(ы)"
        class="mr-24"
        width="170"
        @click="uploadFile"
      />
      <Button
        v-if="profile.role.teacher && !readOnly "
        type="primary"
        label="Создать"
        width="200"
        @click="createTask"
      ></Button>
    </div>
    <template></template>
  </main>
</template>

<script>
import Button from "@/components/ui/Button/Button";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Button
  },
  data() {
    return {
      file: "",
      autocompleteValue: "",
      datePickerOptions: {
        disabledDate(date) {
          return date < new Date().setDate(new Date().getDate() - 1);
        }
      },
      newTaskData: {
        users: [],
        id: null,
        name: "",
        discipline: "Выберите дисциплину",
        description: "",
        issueDate: "",
        thesisDate: "",
        completed: false
      },
      readOnly: null,
      type: "", // если не readOnly - получаем type из params роутера
      taskData: {
        users: []
      }, // если не readOnly - получаем taskData из params роутера
      disciplines: [],
      isShowDeletePopup: false,
      createChat: false,
      showChatCreation: false,
    };
  },
  computed: {
    ...mapState("user", ["profile"]),
    ...mapState("auth", ["token"]),
    pageTitle() {
      return !this.readOnly ? "Создание задания" : this.taskData.name;
    },
    colorData() {
      if (this.taskData.completed) {
        return "green";
      } else {
        return "red";
      }
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
    today() {
      const date = new Date();
      const months = [
        "января",
        "февраля",
        "марта",
        "апреля",
        "мая",
        "июня",
        "июля",
        "августа",
        "сентября",
        "октября",
        "ноября",
        "декабря"
      ];
      return `${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()} г.`;
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
    ...mapActions("user", ["FIND_USERS"]),
    ...mapActions("chat", ["CREATE_CHAT"]),

    uploadFile() {
      // чтобы отправить файлы
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
    handleSelect(item) {
      if (!this.newTaskData.users) {
        this.newTaskData.users = [];
      }
      this.newTaskData.users.push({
        id: item.id,
        fio: item.fio,
        phone: item.phone,
        faculty: item.faculty,
        group: item.group,
        email: item.email,
        user_id: item.id
      });
      this.autocompleteValue = "";
    },
    async deleteUser(id) {
      if (!this.readOnly) {
        this.newTaskData.users = this.newTaskData.users.filter(
          elem => elem.id != id
        );
      } else {
        try {
          await this.DELETE_USER({ id: this.taskData.id, user_id: id });
          this.taskData.users = this.taskData.users.filter(
            elem => elem.id != id
          );
        } catch (err) {
          this.$notify.error({
            title: "Ошибка!",
            message: "Что-то пошло не так"
          });
        }
      }
      this.isShowDeletePopup = false;
    },
    handleDropDownSelect(command) {
      this.newTaskData.discipline = command;
    },
    async createTask() {
      try {
        await Promise.all([
          this.CREATE_TASK({ taskData: this.newTaskData, taskType: this.type })
        ]);
        this.readOnly = true;
        this.taskData = this.newTaskData;
      } catch (err) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
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
      console.log(this.UPLOAD(this.file));
    },
    downloadReport() {
      try {
        this.DOWNLOAD_REPORT({ id: this.taskData.id });
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
    async create_chat() {
      try {
        await this.CREATE_CHAT({name: this.taskData.name, users: this.taskData.users})
        this.createChat = true;
        this.showChatCreation = false
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    }
  },
  async mounted() {
    if (!this.$route.params.type) this.$router.push({ name: "home" });
    this.readOnly = this.$route.params.readOnly;
    this.type = this.$route.params.type;
    this.taskData = Object.assign(this.taskData, this.$route.params.taskData);
    if (this.readOnly) {
      try {
        const result = await this.GET_TASK({
          taskType: this.type,
          id: this.taskData.id
        });
        this.taskData = result;
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    }

    if (!this.readOnly) {
      this.newTaskData.issueDate = this.today; // кол-во мс, прошедших с 01.01.1970 г. по UTC
      try {
        const result = await this.GET_DISCIPLINES();
        this.disciplines = result.disciplines;
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.page {
  padding-top: 30px;
}
.mgt {
  margin-top: 10px;
}
.el-dropdown-link {
  cursor: pointer;
  color: var(--background);
}
.el-icon-arrow-down {
  font-size: 12px;
}
.task {
  padding: 24px;
  background: var(--white);
  border-radius: var(--border-radius);
  &__desc {
    font-family: "Exo 2";
    width: 75%;
    min-height: 50px;
    font-size: 16px;
  }
  &__info {
    display: flex;
    flex-direction: column;
  }
  &__input {
    width: 100%;
    max-width: 300px;
  }
}
.autocomplete,
.calendar {
  width: 100%;
  max-width: 400px;
}
.title {
  right: 0;
  width: 30%;
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
  width: 70%;
}
.task-type {
  width: fit-content;
  padding: 8px 12px;
  margin-right: 8px;
  border-radius: 24px;
  background: #9b9b9b;
  color: var(--white);
}
.task-completed {
  width: fit-content;
  padding: 8px 12px;
  margin-right: 8px;
  border-radius: 24px;
  background: var(--primary);
  color: var(--white);
}
.actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.flex {
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  margin-top: 10px;
}
.rigt-auto {
  margin-right: auto;
}

.mr20 {
  margin-right: 20px;
}
</style>

<style>
.el-table .common-row {
}

.el-table .success-row {
  background: #c2eeaa;
}
</style>
