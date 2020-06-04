<template>
  <div class="page">
    <h4 style="margin-top: 10px; ">Заголовок</h4>
    <el-input
      placeholder="Введите заголовок"
      v-model="title"
      style="margin-top: 10px; font-family: Arial, Helvetica, sans-serif;"
    ></el-input>
    <h4 style="margin-top: 10px; ">Выберите или введите категорию</h4>
    <div class="page__category">
      <el-select
        v-model="category_1"
        placeholder="Выберите категорию"
        class="page__category__selector"
        @change="handleSelect"
      >
        <el-option v-for="c in categories" :key="c" :label="c" :value="c"></el-option>
      </el-select>
      <el-input
        placeholder="Введите категорию"
        v-model="category"
        @change="handleInput"
        class="page__category__input"
      ></el-input>
    </div>
    <h4 style="margin-top: 30px;">Описание</h4>
    <textarea v-model="body" class="page__body" style="margin-top: 10px;" />
    <h4 style="margin-top: 30px;">Изображение</h4>
    <el-upload
      class="upload-demo mr-24"
      ref="upload"
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :on-change="handleSuccess"
      :on-remove="handleRemoveFile"
      action
    >
      <Button slot="trigger" type="simple" label="Выбрать файл" class="down" width="170" />
    </el-upload>
    <h4 style="margin-top: 30px;">Файл</h4>
    <el-upload
      class="upload-demo mr-24"
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false"
      :on-change="handleSuccessFile"
      :on-remove="handleRemove"
      action
    >
      <Button slot="trigger" type="simple" label="Выбрать файл" class="down" width="170" />
    </el-upload>
    <div class="page__footer">
      <Button
        class="page__footer__button"
        type="simple"
        label="Предпросмотр"
        @click="showPreviewPopup = true"
      />
      <Button class="page__footer__button" type="success" label="Создать" @click="createNews" />
      <el-dialog :visible.sync="showPreviewPopup" title="Предпросмотр новости">
        <div class="page__card">
          <div class="page__card__header">
            <p
              style="margin-right: auto; font-size:20px; font-family: Arial, Helvetica, sans-serif;"
            >{{ title }}</p>
          </div>
          <div class="page__card__internal">
            <div class="page__card__internal__body">{{ body }}</div>
            <div class="page__card__internal__image">
              <img v-if="image_bytes" style="width:100%;" :src="image_bytes" />
            </div>
            <div v-if="doc_name" class="page__card__internal__doc">
              <i class="el-icon-document"></i>
              <p style="margin-left:7px;" class="doc-name">{{ doc_name }}</p>
            </div>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import { mapActions } from "vuex";
import Button from "@/components/ui/Button/Button";
export default {
  name: "News",
  components: {
    Button
  },
  data() {
    return {
      showPreviewPopup: false,
      categories: [],
      title: "",
      body: "",
      image_bytes: undefined,
      category: "",
      category_1: "",
      doc_name: undefined,
      doc_raw: undefined
    };
  },
  methods: {
    ...mapActions("news", ["GET_NEWS", "DELETE_NEWS", "CREATE_NEWS"]),
    async createNews() {
      try {
        await this.CREATE_NEWS({
          file: this.doc_raw,
          data: {
            title: this.title,
            image_bytes: this.image_bytes,
            body: this.body,
            category: this.category,
            doc_name: this.doc_name
          }
        });
        this.$router.push({
          name: "news"
        });
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    querySearch(_, callback) {
      callback(this.categories);
    },

    handleSelect() {
      this.category = this.category_1;
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

    handleInput() {
      this.category_1 = this.category;
    },
    readFileAsync(file) {
      return new Promise((resolve, reject) => {
        let reader = new FileReader();

        reader.onload = () => {
          resolve(reader.result);
        };

        reader.onerror = reject;

        reader.readAsDataURL(file);
      });
    },
    async handleSuccess(file) {
      try {
        this.image_bytes = await this.readFileAsync(file.raw);
      } catch (err) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    handleSuccessFile(file) {
      console.log(file);
      this.doc_name = file.name;
      this.doc_raw = file.raw;
    },
    handleRemoveFile() {
      this.doc_name = undefined;
      this.doc_raw = undefined;
    }
  },
  async mounted() {
    try {
      const resp = await this.GET_NEWS();
      var i;
      for (i = 0; i < resp.length; i++) {
        this.categories.push(resp[i].category);
      }
      this.categories = [...new Set(this.categories)];
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
  display: flex;
  flex-direction: column;

  &__category {
    display: flex;
    justify-content: flex-start;

    &__selector {
      width: 300px;
    }

    &__input {
      width: 350px;
      margin-left: 20px;
    }
  }

  &__body {
    padding: 5px;
    border-radius: 4px;
    border: 2px solid #cecece;
    font-family: Arial, Helvetica, sans-serif;
    min-height: 300px;
    font-size: 16px;
  }

  &__footer {
    display: flex;
    justify-content: flex-end;

    &__button {
      width: 150px;
      margin-top: 30px;
      margin-left: 15px;
    }
  }

  &__card {
    width: 100%;
    border-radius: 5px;
    border: 1px solid #dbdbdb;
    margin-bottom: 20px;

    &__header {
      height: 40px;
      display: flex;
      padding: 10px;
      justify-content: flex-end;
      font-size: 20px;
      font-weight: 900;
    }

    &__internal {
      padding: 10px;
      background-color: #f8f8f8;
      padding-bottom: 20px;

      &__body {
      }

      &__image {
        margin-top: 20px;
      }

      &__doc {
        margin-top: 20px;
        display: flex;
      }

      &__doc:hover {
        color: blue;
        cursor: pointer;
      }
    }
  }
}
</style>