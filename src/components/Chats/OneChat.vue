<template>
  <div class="chat">
    <div class="chat__header">
      <h2>{{ chat.name }}</h2>
      <p
        style="margin-left:auto; color: grey; font-size: 10pt; font-style:italic;"
      >{{ chat.users.length + num2str(chat.users.length, [' участник', ' участника', ' участников']) }}</p>
      <i class="el-icon-s-tools delete-icon" @click="showsetting = true"></i>
    </div>
    <div class="chat__list" ref="messagesContainer">
      <div v-for="message in chat.messages" :key="message.id">
        <div class="chat__list__message">
          <div class="chat__list__message__header">
            <p>{{ message.created_by_fio }}</p>
            <p>{{ message.created_at }}</p>
          </div>
          <div class="chat__list__mesage__body">
            <p>{{ message.text }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="chat__input">
      <el-input placeholder="Введите сообщение..." v-model="input" @keyup.enter.native="addMessage"></el-input>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "Chat",
  data() {
    return {
      id: "",
      chat: { messages: [], users: [] },
      input: "",
      showsetting: false,
      chat_id: ""
    };
  },
  methods: {
    ...mapActions("chat", ["GET_CHAT", "GET_ALL_MESSAGES", "ADD_MESSAGE"]),
    async getMessages() {
      const msgs = await this.GET_ALL_MESSAGES(this.chat_id);
      this.chat.messages = msgs;
    },
    async addMessage() {
      try {
        const resp = await this.ADD_MESSAGE({
          id: this.chat_id,
          message: { text: this.input }
        });
        this.chat.messages.push(resp);
      } catch (e) {
        this.$notify.error({
          title: "Ошибка!",
          message: "Что-то пошло не так"
        });
      }
    },
    num2str(n, text_forms) {
      n = Math.abs(n) % 100;
      var n1 = n % 10;
      if (n > 10 && n < 20) {
        return text_forms[2];
      }
      if (n1 > 1 && n1 < 5) {
        return text_forms[1];
      }
      if (n1 == 1) {
        return text_forms[0];
      }
      return text_forms[2];
    }
  },
  beforeDestroy: function() {
    clearInterval(this.interval);
  },
  async mounted() {
    try {
      this.chat_id = this.$route.params.id;
      const resp = await this.GET_CHAT(this.chat_id);
      this.chat = resp;
      const msgs = await this.GET_ALL_MESSAGES(this.chat_id);
      this.chat.messages = msgs;
      //this.interval = setInterval(this.getMessages.bind(this), 3000);
      //this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
    } catch (e) {
      this.$notify.error({
        title: "Ошибка!",
        message: "Что-то пошло не так"
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.chat {
    width: 50%;
    min-width: 700px;
  &__header {
    border-bottom: 1px solid gray;
    padding-left: 20px;
    display: flex;
    align-items: center;
  }
  &__list {
    padding-left: 20px;
    padding-top: 20px;
    max-height: 50vh;
    min-height: 50vh;
    overflow: scroll;
    &__message {
      margin-bottom: 30px;
      background-color: rgb(243, 243, 243);
      border-radius: 20px;
      padding: 10px;
      margin-right: 25px;
      &__header {
        display: flex;
        justify-content: space-between;
        font-size: 10pt;
        font-weight: bold;
        color: grey;
        margin-top: auto;
        padding-bottom: 5px;
      }
      &__body {
      }
    }
  }
  &__input {
    background-color: rgb(243, 243, 243);
    padding: 13px;
  }
}

.delete-icon {
  margin-left: 15px;
}

.delete-icon:hover {
  color: #ffd04b;
}
</style>

<style>
.chat__input .el-input__inner {
  border-radius: 6px;
  border: unset !important;
}
</style>