<template>
  <main class="chat_page">
    <div class="chats">
      <div class="chats__list">
        <div class="chats__list__header">
          <h2>Чаты</h2>
          <i class="el-icon-circle-plus add-icon" @click="createChat"></i>
        </div>
        <div class="chats__list__list">
          <div
            v-for="(chat, index) in chats"
            class="chats__list__list__element"
            v-bind:class="[id === chat.id && 'back']"
            :key="chat.id"
            @click="id = chat.id"
          >
            <div class="chats__list__list__element__header">
              <p class="chats__list__list__element__header__name">{{ chat.name }}</p>
              <p
                class="chats__list__list__element__header__leal"
                v-if="chat.messages.length > 0"
              >{{ chat.messages[0].created_at}}</p>
              <i class="el-icon-delete" @click.stop="show = true" />
              <el-dialog title="Хотите удалить чат" :visible.sync="show" width="550px">
                <p>Вы уверены, что хотите удалить чат?</p>
                <div slot="footer" class="btn-footer">
                  <Button
                    type="reject"
                    label="Отменить"
                    width="150"
                    class="mr-24"
                    @click="show = false"
                  />
                  <Button
                    type="primary"
                    label="Да, удалить"
                    width="150"
                    @click="deleteChat(chats[index].id)"
                  />
                </div>
              </el-dialog>
            </div>
            <p
              class="chats__list__list__element__last"
              v-if="chat.messages.length > 0"
            >{{ chat.messages[0].created_by_fio + " : " + chat.messages[0].text}}</p>
            <p class="chats__list__list__element__last" v-else>В чате еще нет сообщений...</p>
          </div>
        </div>
      </div>
      <div class="chats__body">
        <Chat v-if="!!id" :chat_id="id" @add_message="add_message" />
      </div>
    </div>
  </main>
</template>
<script>
import { mapActions } from "vuex";
import Chat from "./Chat.vue";
import Button from "@/components/ui/Button/Button";

export default {
  components: {
    Chat,
    Button
  },
  data() {
    return {
      id: "",
      chats: [],
      active: false,
      show: false,
      showCreating: false
    };
  },
  computed: {
    activeChat() {
      return this.id;
    }
  },
  methods: {
    ...mapActions("chat", ["GET_CHATS", "DELETE_CHAT"]),
    add_message(msg) {
      var i, j;
      for (i = 0; i < this.chats.length; i++) {
        if (this.chats[i].id === this.id) {
          j = i;
          break;
        }
      }
      this.chats[j].messages = [msg];
    },
    async deleteChat(id) {
      try {
        console.log(id);
        //await this.DELETE_CHAT(id);
        this.show = false;
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    async createChat() {
      try {
        this.$router.push({
          name: "chats-creating"
        });
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
      const resp = await this.GET_CHATS();
      this.chats = resp.chats;
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
.chat_page {
  height: 100%;
}
.chats {
  display: flex;
  justify-content: flex-start;
  min-width: 1000px;
  padding-top: 40px;
  padding-left: 40px;
  padding-right: 40px;

  &__list {
    width: 300px;

    &__header {
      border-bottom: 1px solid gray;
      display: flex;
      align-items: center;
    }

    &__list {
      display: flex;
      flex-direction: column;

      &__element {
        width: 100%;
        border-bottom: 1px solid grey;
        min-height: 50px;
        display: flex;
        flex-direction: column;
        padding: 10px;
        padding-bottom: 2px;
        cursor: default;

        &__last {
          font-style: italic;
          font-size: 10pt;
          color: grey;
          margin-top: auto;
        }

        &__header {
          display: flex;
          justify-content: flex-end;
          align-items: center;

          &__leal {
            font-size: 10pt;
            color: grey;
            margin-right: 10px;
          }

          &__name {
            margin-right: auto;
          }

          &__delete {
            color: grey;
          }
        }
      }
    }
  }

  &__body {
    width: 600px;
    height: 100%;
    min-height: 500px;
    border-left: 1px solid grey;
  }
  .back {
    background-color: rgb(241, 241, 241);
  }
  .add-icon {
    margin-left: auto;
    margin-right: 10px;
  }
  .add-icon:hover {
    color: #ffd04b;
  }
}
</style>