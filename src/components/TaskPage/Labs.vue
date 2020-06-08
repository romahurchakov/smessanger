<template>
  <div class="page">
    <p style="font-weight: bold; margin-top: 15px;">Выберите дисциплину:</p>
    <el-select
      style="margin-top: 15px;"
      v-model="selected"
      placeholder="Выберите дисциплину"
      @change="selectDiscipline"
    >
      <el-option
        v-for="discipline in disciplines"
        :key="discipline.id"
        :label="discipline.name"
        :value="discipline.name"
      ></el-option>
    </el-select>
    <div v-if="!!selected" style="margin-top: 15px;">
      <p style="font-weight: bold;">Исходные данные:</p>
      <textarea v-model="raw" class="page__raw" style="margin-top: 10px;" />
      <div>
        <Button
          style="margin-left: auto; margin-top: 15px"
          type="simple"
          label="Подтвердить"
          width="150"
          @click="submit"
        />
      </div>
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
      file: "",
      autocompleteValue: "",
      disciplines: [],
      isShowDeletePopup: false,
      createChat: false,
      showChatCreation: false,
      newThesisDate: "",
      to_delete: {},
      selected: "",
      raw: ""
    };
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
      "DELETE_USER",
      "GET_RAW"
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
    async deleteUser() {
      if (!this.readOnly) {
        this.newTaskData.users = this.newTaskData.users.filter(
          elem => elem.id != this.to_delete.id
        );
      } else {
        try {
          await this.DELETE_USER({
            id: this.taskData.id,
            user_id: this.to_delete.id
          });
          this.taskData.users = this.taskData.users.filter(
            elem => elem.id != this.to_delete.id
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
        this.newTaskData.thesisDate = this.newThesisDate;
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
    submitFile() {
      console.log(this.UPLOAD(this.file));
    },
    async submit() {
      try {
        var i, j;
        for (i = 0; i < this.disciplines.length; i++) {
          if (this.disciplines[i].name === this.selected) {
            j = i;
            break;
          }
        }
        await this.CREATE_TASK({
          discipline: this.disciplines[j].id,
          raw: this.raw
        });
        this.$notify({
          title: "Успешно!",
          message: "Данные успешно подтверждены"
        });
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    forceFileDownload(response) {
      const url = window.URL.createObjectURL(
        new Blob([response], { type: response.headers["content-type"] })
      );
      const link = document.createElement("a");
      link.href = url;
      link.download = "Your_file_name";
      link.click();
    },
    async downloadReport() {
      try {
        const resp = await this.DOWNLOAD_REPORT({ id: this.taskData.id });
        this.forceFileDownload(resp);
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    async selectDiscipline(value) {
      try {
        var i, j;
        for (i = 0; i < this.disciplines.length; i++) {
          if (this.disciplines[i].name === value) {
            j = i;
            break;
          }
        }
        const res = await this.GET_RAW({ discipline: this.disciplines[j].id });
        this.raw = res;
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
      const result = await this.GET_DISCIPLINES();
      this.disciplines = result.disciplines;
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
.page {
  width: 80%;
  min-height: 700px;

  &__raw {
    width: 100%;
    min-height: 700px;
  }
}
</style>