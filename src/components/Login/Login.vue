<template>
    <main class="container login-page">
        <div class="auth-card">
            <h3 class="auth-card__title">Вход</h3>
            <div class="auth-card__form">
                <el-input class="auth-card__input" placeholder="Логин" v-model="login"/>
                <el-input class="auth-card__input" placeholder="Пароль" show-password v-model="password"/>
                <Button label="Войти" type="primary" class="auth-card__enter-btn" @click="auth"/>
                <p class="hint-text auth-text" @click="isShowPopup = true">Не зарегистрированы?</p>
            </div>
        </div>

        <el-dialog title="Регистрация пользователя" :visible.sync="isShowPopup">
            <p> Обратитесь в службу поддержки для создания нового пользователя </p>
        </el-dialog>
    </main>
</template>

<script>
    import Button from '@/components/ui/Button/Button.vue'
    import { mapActions } from 'vuex'
    export default {
        components: {
            Button
        },
        data() {
            return {
                isShowPopup: false,
                login: '',
                password: '',
                authForm: {
                    login: '',
                    password: '',
                    role: ''
                },
                input: ''
            }
        },
        mounted() {

        },
        methods: {
             ...mapActions('auth', ['LOGIN']),
            async auth() {
                try {
                    await this.LOGIN({login:this.login, password: this.password})
                    this.$router.push("/home")
                } catch (e) {
                    this.$notify.error({
                        title: 'Ошибка!',
                        message: 'Что-то пошло не так'
                    })
                }
            }
        }
    }
</script>

<style lang="scss">
    .login-page {
        height: 50vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .auth-card {
        width: 100%;
        max-width: 500px;
        display: flex;
        align-items: center;
        flex-direction: column;
        padding: 16px 24px;
        border-radius: var(--border-radius);
        background: var(--white);
        box-shadow:var(--all-sides-shadow);
        &__title {
            margin-bottom: 16px;
        }
        &__form {
            width: 100%;
            max-width: 280px;
            display: flex;
            flex-direction: column;
        }
        &__input {
            margin-bottom: 24px;
        }
        &__enter-btn {
            margin-bottom: 8px;
        }
    }
    .auth-text {
        cursor: pointer;
        transition: var(--hover-transition);
        &:hover {
            color: var(--blue);
            text-decoration: underline;
            transition: var(--hover-transition);
        }
    }
</style>
