<template>
    <main class="page">
        <div class="mb-40">
            <p class="text-style">
            </p>
        </div>
        <article>
            <el-tabs v-model="activeTab" @tab-click="onTabClickandler">
                <el-tab-pane label="Лабы" name="labs" class="tab-opener">
                    <TaskTable :tableData="tableDataLabs" type="labs" :deleteTask="deleteTask"/>
                </el-tab-pane>
                <el-tab-pane label="Курсовые" name="courses" class="tab-opener" :disabled="true">
                    <TaskTable :tableData="tableDataCourses" type="courses" :deleteTask="deleteTask"/>
                </el-tab-pane>
            </el-tabs>
        </article>
    </main>
</template>

<script>
    import TaskTable from '@/components/TaskPage/TaskTable'
    import { mapActions } from 'vuex'
    export default {
        components: {
            TaskTable
        },
        data() {
            return {
                activeTab: 'labs',
                tableDataLabs: [
                ],
                tableDataCourses: [
                ]
            }
        },
        methods: {
            ...mapActions('tasks', ['GET_TASKS', 'DELETE_TASK']),
            onTabClickandler() {

            },
            async deleteTask(id, deletedElemID, type) {
                try {
                    await this.DELETE_TASK({id:id,taskType:type})
                    switch (type) {
                    case 'labs':
                        this.tableDataLabs = this.tableDataLabs.filter(elem => elem.id !== id)
                        break
                    case 'courses':
                       this.tableDataCourses = this.tableDataCourses.filter(elem => elem.id !== id)
                       break
                    }
                } catch (e) {
                    console.log(e)
                    this.$notify.error({
                        title: 'Ошибка!',
                        message: 'Что-то пошло не так'
                    })
                }
}
        },
        async mounted() {
            // запрашиваем лабы и курсовые, формируем таблицы на странице
            try {
                const [ labs, courses ] = await Promise.all([
                    this.GET_TASKS({ taskType: 'labs' }),
                    this.GET_TASKS({ taskType: 'labs' })
                ])
                this.tableDataLabs = labs
                this.tableDataCourses = courses
            } catch (err) {
                this.$notify.error({
                    title: 'Ошибка!',
                    message: err.message
                })
            }
        }
    }
</script>

<style lang="scss">
    .tab-opener {
        animation: animate .7s ease-in-out;
    }
    @keyframes animate {
        from {
            opacity: 0;
        } to {
            opacity: 1;
        }
    }
</style>
