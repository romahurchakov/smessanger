<template>
    <div>
        <el-dropdown v-if="isAuth">
            <div>
                <span :class="['mr-40','el-dropdown-link']">
                    {{ name }}
                </span>
            </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="child in dropDownItems" :key="child.title">
                    <router-link tag="a" class="auth__link" :to="{ name: child.linkTo }">
                        <span>{{ child.title }}</span>
                    </router-link>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <router-link :class="['mr-40']" v-else  tag="a" :to="{ name: 'login' }">
            <el-button class="lol">Войти</el-button>
        </router-link>
    </div>
</template>



<script>
export default {
  name: 'Auth',

  data: function() {
    return {
        name:'',
    }
  },

  mounted() {
    if (localStorage.name) {
      this.name = localStorage.name;
    }
  },

  computed: {
            isAuth() {
                return this.name
            },
            dropDownItems() {
                const items = [];
                items.push({ title: 'Профиль', linkTo: 'assignment', path: '/assignment' });
                items.push({ title: 'Новости', linkTo: 'assignment', path: '/assignment' });
                return items;
            },
     }
}
</script>


<style scoped lang="scss">
    .container {
        justify-self: flex-end;
        width: fit-content;
        margin-left: auto;
    }
    .auth {
        background-color: var(--black);
        padding: var(--standart-padding);
        color: var(--black);

        &__link {
            color: var(--black);
            font-size: 16px;
            text-decoration: none;
            &:hover {
                color: var(--primary);
            }
            &_active {
                position: relative;
                color: var(--primary);
                &::after {
                    content: '';
                    position: absolute;
                    bottom: -16px;
                    left: 0;
                    width: 100%;
                    height: 2px;
                    background: var(--primary);
                }
            }
        }

    }
</style>

<style >

</style>
