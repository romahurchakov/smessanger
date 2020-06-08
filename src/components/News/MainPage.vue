<template>
  <div class="news_page">
    <div class="news_page__body">
        <el-select
          placeholder="Выберите категорию"
          class="news_page__input"
          v-model="category_filter"
          @change="filterByCategory"
          allow-create
        >
          <el-option label="Все категории" value="all"></el-option>
          <el-option-group label="Категории">
            <el-option
              v-for="category in categories"
              :key="category"
              :label="category"
              :value="category"
            ></el-option>
          </el-option-group>
        </el-select>
        <div class="news_page__card" v-for="elem in news" :key="elem.id">
          <div class="news_page__card__header">
            <p
              style="margin-right: auto; font-size:20px; font-family: Arial, Helvetica, sans-serif;"
            >{{ elem.title }}</p>
          </div>
          <div class="news_page__card__internal">
            <div class="news_page__card__internal__body">{{ elem.body }}</div>
            <div class="news_page__card__internal__image">
              <img v-if="elem.image_bytes" style="width:100%;" :src="elem.image_bytes" />
            </div>
            <div v-if="elem.doc_name" class="news_page__card__internal__doc" @click="downloadFile(elem)">
              <i class="el-icon-document"></i>
              <p style="margin-left:7px;" class="doc-name">{{ elem.doc_name }}</p>
            </div>
          </div>
          <div class="news_page__card__footer">
          <p
            style="margin-left: auto; font-size:14px; font-family: Arial, Helvetica, sans-serif;"
          >{{ elem.created_at }}</p>
        </div>
        </div>
    </div>
  </div>
</template>


<script>
import { mapActions } from "vuex";
export default {
  name: "News",
  components: {},
  data() {
    return {
      back_news: [],
      news: [],
      search: "",
      to_delete: undefined,
      showDeletePopup: false,
      categories: [],
      category_filter: undefined
    };
  },
  methods: {
    ...mapActions("news", ["GET_NEWS", "DELETE_NEWS", "DOWNLOAD_REPORT"]),
    createNews() {
      this.$router.push({
        name: "news-create"
      });
    },
    async deleteNews() {
      try {
        await this.DELETE_NEWS(this.to_delete);
        this.to_delete = undefined;
        const resp = await this.GET_NEWS();
        this.back_news = resp;
        this.news = resp;
        var i;
        this.categories = [];
        for (i = 0; i < resp.lenght; i++) {
          this.categories.push(resp[i].category);
        }
        this.categories = [...new Set(this.categories)];
        this.showDeletePopup = false;
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    querySearch(value, callback) {
      try {
        const regex = new RegExp(".*" + this.search + ".*", "g");
        callback(
          this.news.filter(elem => {
            if (!elem.categoryя) return;
            elem.category.match(regex);
          })
        );
      } catch (e) {
        callback([{}]);
      }
    },
    handleSelect(item) {
      this.search = item;
    },
    filterByCategory() {
      if (this.category_filter == "all") {
        this.news = this.back_news;
        return;
      } else {
        this.news = this.back_news.filter(
          elem => elem.category == this.category_filter
        );
      }
    },
    forceFileDownload(response, filename) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
    },
    async downloadFile(elem) {
      try {
        const resp = await this.DOWNLOAD_REPORT({name: elem.doc_name});
        this.forceFileDownload(resp, elem.doc_name);
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
      const resp = await this.GET_NEWS();
      this.back_news = resp;
      this.news = resp;
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
.news_page {
  display: flex;
  flex-direction: column;
  align-items: center;

  &__input {
    margin-bottom: 20px;
  }

  &__header {
    padding: 10px;
    display: flex;
    width: 100%;
    max-width: 80vh;
    justify-content: center;

    &__search {
      display: flex;
      align-items: center;
      width: 250px;
    }

    &__create {
      display: flex;
      align-items: center;
      width: 250px;
      margin-left: 45px;
      height: 40px;
    }
  }

  &__body {
    margin-top: 30px;
    width: 750px;
  }

  &__card {
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

    &__footer {
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
  .delete-hover:hover {
    font-weight: bold;
  }
  .button_simple {
    height: 40px !important;
  }
}
</style>