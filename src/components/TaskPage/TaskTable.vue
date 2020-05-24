<template>
    <div class="home">
        <div class="article">
            <div class="fl mb-24">
                <el-autocomplete
                     class="autocomplete mr-24" v-model="autocompleteValue" :trigger-on-focus="false"
                     :fetch-suggestions="querySearch" placeholder="Начните вводить" @select="handleSelect">
                     <i class="el-icon-search el-input__icon" slot="suffix"/>
                     <template slot-scope="{ item }">
                            <div v-if="item.name">
                                {{ item.name }}
                            </div>
                            <div v-else>Поиск не дал результатов</div>
                        </template>
                </el-autocomplete>
                <Button type="primary" :label="createBtnLabel" width="300" @click="createTask"  v-if="profile.role.teacher"/>
            </div>
            <el-table :data="tableData.filter(data=> !autocompleteValue || !data.name || data.name.toLowerCase().includes(autocompleteValue.toLowerCase()))"  @row-click="onTableClickHandler" empty-text="Нет данных">
                <el-table-column prop="name" label="Название" :filters=filter :filter-method="filterHandler"/>
                <el-table-column prop="fio" label="ФИО"/>
                <el-table-column prop="faculty" label="Факультет"/>
                <el-table-column prop="group" label="Группа"/>
                <el-table-column prop="discipline" label="Дисциплина"/>
                <el-table-column prop="thesisDate" label="Дедлайн"/>
                <el-table-column v-if="profile.role.teacher">
                    <template slot-scope="scope">
                        <Button @click="isShowPopup = true; id = scope.$index" label="Удалить"/>
                    </template>
                </el-table-column>
            </el-table>
            <Button type="primary" label='Excel' width="170" class="excel" @click="downloadExcel" v-if="profile.role.teacher"/>
        </div>
        <el-dialog title="Хотите удалить задание" :visible.sync="isShowPopup" width="550px">
            <p>
                Вы уверены, что хотите удалить задание?
            </p>
            <div slot="footer" class="btn-footer">
                <Button type="reject" label="Отменить" width="150" class="mr-24" @click="isShowPopup = false"/>
                <Button type="primary"
                        label="Да, удалить" width="150" @click="approveDeleteTask"/>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Button from '@/components/ui/Button/Button'
    import { mapState, mapActions } from 'vuex'
    export default {
        components: {
            Button
        },
        props: {
            tableData: { type: Array },
            type: { type: String },
            deleteTask: { type: Function }
        },
        data() {
            return {
                isShowPopup: false,
                autocompleteValue: '',
                id: -1,
                filter: [
                    {text: 'asd', value: 'asd'}
                ]
            }
        },
        computed: {
            ...mapState('user', ['profile']),
            createBtnLabel() {
                switch (this.type) {
                    case 'labs':
                        return 'Создать лабораторную работу';
                    case 'courses':
                        return 'Создать курсовую работу';
                }
                return ''
            }
        },
        methods: {
            ...mapActions('tasks', ['EXCEL']),
            approveDeleteTask() {
                this.deleteTask(this.tableData[this.id].id, this.id, this.type)
                this.isShowPopup = false
            },
            createTask() {
                this.$router.push({
                    name: 'create-task',
                    params: {
                        readOnly: false,
                        taskData: {},
                        type: this.type
                    }
                })
            },
            onTableClickHandler(taskData, column) {
                if (!column.label) return
                this.$router.push({
                    name: 'create-task',
                    params: {
                        readOnly: true,
                        taskData: taskData,
                        type: this.type
                    }
                })
            },
            querySearch(value, callback) {
                try {
                    // const results = await this.SEARCH_STUDENTS({ fio: value })
                    // if (Array.isArray(results)) callback(results);
                    const regex = new RegExp('.*' + this.autocompleteValue + '.*', 'g');
                    callback(this.tableData.filter(elem => {
                        if (!elem.name) return
                        elem.name.match(regex)
                    }));
                } catch (e) {
                    console.log(e)
                    callback([{}])
                }
            },
            handleSelect(item) {
                this.autocompleteValue = item.name
                this.filter = [item.name]
            },
            filterHandler(value, row, column) {
                const property = column['property'];
                return row[property] === value;
            },
            async downloadExcel() {
                try {
                    const kek = await this.EXCEL()
                    this.forceFileDownload(kek)
                } catch (e) {
                    this.$notify.error({
                        title: 'Ошибка!',
                        message: 'Не удалось скачать excel'
                    })
                }
            },
            forceFileDownload(response){
                const url = window.URL.createObjectURL(new Blob([response]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', 'file.xlsx')
                document.body.appendChild(link)
                link.click()
            },
        }
    }
</script>

<style>
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
</style>
