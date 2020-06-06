<template>
  <div class="home">
    <div class="article">
      <div class="fl mb-24">
        <el-autocomplete
          class="autocomplete mr-24"
          v-model="autocompleteValue"
          :trigger-on-focus="false"
          :fetch-suggestions="querySearch"
          placeholder="Поиск по названию"
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
          width="300"
          @click="isShowCreatePopup = true"
        />
        <el-dialog title="Создание группы" :visible.sync="isShowCreatePopup">
          <p class="hint-text mb-8">Название группы</p>
          <el-input placeholder="Название" v-model="creating.name" />
          <el-switch v-model="creating.is_study" active-text="Учебная" style="margin-top:30px;"></el-switch>
          <div slot="footer" class="btn-footer">
            <Button
              type="simple"
              label="Отменить"
              width="150"
              class="mr-24"
              @click="isShowCreatePopup = false"
            />
            <Button type="simple" label="Создать" width="150" @click="createGroup" />
          </div>
        </el-dialog>
      </div>
      <el-table
        :data="tableData.filter(data=> !autocompleteValue || !data.name || data.name.toLowerCase().includes(autocompleteValue.toLowerCase()))"
        empty-text="Нет данных"
      >
        <el-table-column width="100px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.is_study">Учебная</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Название" />
        <el-table-column prop="num" label="Численность" />
        <el-table-column width="50px">
          <template slot-scope="scope">
            <i
              @click="isShowDeletePopup = true; delete_row = scope.row"
              v-if="!scope.row.is_study"
              class="el-icon-delete"
            />
          </template>
        </el-table-column>
        <el-table-column width="50px">
          <template slot-scope="scope">
            <i @click="updateGroup(scope.row)" class="el-icon-edit" />
            <el-dialog
              title="Хотите удалить группу"
              :visible.sync="isShowDeletePopup"
              width="550px"
            >
              <p>Вы уверены, что хотите удалить группу?</p>
              <div slot="footer" class="btn-footer">
                <Button
                  type="reject"
                  label="Отменить"
                  width="150"
                  class="mr-24"
                  @click="isShowDeletePopup = false"
                />
                <Button type="primary" label="Да, удалить" width="150" @click="deleteGroup" />
              </div>
            </el-dialog>
          </template>
        </el-table-column>
        <el-table-column width="50px">
          <template slot-scope="scope">
            <i
            title="Перевести учебную группу"
              v-if="scope.row.is_study"
              @click="transferGroup(scope.row)"
              class="el-icon-truck"
            />
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
  props: {
    tableData: { type: Array }
  },
  data() {
    return {
      isShowDeletePopup: false,
      isShowCreatePopup: false,
      autocompleteValue: "",
      id: -1,
      filter: [{ text: "asd", value: "asd" }],
      creating: {},
      roles: [],
      delete_row: {}
    };
  },
  computed: {
    createBtnLabel() {
      return "Создать группу";
    }
  },
  methods: {
    ...mapActions("user", ["DELETE_GROUP", "CREATE_GROUP"]),
    async createGroup() {
      try {
        await this.CREATE_GROUP(this.creating);
        this.isShowCreatePopup = false;
        this.creating = {};
        this.$emit("update-table");
      } catch (err) {
        this.$notify.error({
          title: "Ошибка!",
          message: err.message
        });
      }
    },
    async deleteGroup() {
      try {
        await this.DELETE_GROUP(this.delete_row.id);
        this.isShowDeletePopup = false;
        this.$emit("update-table");
      } catch (err) {
        this.$notify.error({
          title: "Ошибка!",
          message: err.message
        });
      }
    },
    updateGroup(row) {
      this.$router.push({
        name: "change-group",
        params: {
          id: row.id
        }
      });
    },
    transferGroup(row) {
      this.$router.push({
        name: "group-transfer",
        params: {
          id: row.id
        }
      });
    },
    querySearch(value, callback) {
      try {
        // const results = await this.SEARCH_STUDENTS({ fio: value })
        // if (Array.isArray(results)) callback(results);
        const regex = new RegExp(".*" + this.autocompleteValue + ".*", "g");
        callback(
          this.tableData.filter(elem => {
            if (!elem.name) return;
            elem.name.match(regex);
          })
        );
      } catch (e) {
        console.log(e);
        callback([{}]);
      }
    },
    handleSelect(item) {
      this.autocompleteValue = item.name;
      this.filter = [item.name];
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    }
  }
};
</script>

<style lang="scss" scoped>
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
.flex {
  display: flex;
}
</style>
