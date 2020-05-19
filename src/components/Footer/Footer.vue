<template>
  <footer class="footer">
    <div class="wrapper">
      <div class="wrapper__cafedra">
        <div>
          <router-link :to="{ name: 'home' }">
            <section class="wrapper__cafedra__name">Кафедра ИУ9</section>
          </router-link>
        </div>
        <div class="wrapper__cafedra__social_wrapper">
          <a href="https://vk.com/iu_stream" target="_blank" rel="noopener noreferrer">
            <img src="../../assets/images/multimedia.png" width="35px" class="filter" />
          </a>
          <a href="https://github.com/bmstu-iu9" target="_blank" rel="noopener noreferrer">
            <img src="../../assets/images/shape.png" width="35px" class="filter" />
          </a>
        </div>
      </div>
      <div class="wrapper__copyright">
        <div class="wrapper__copyright__icon">
          <img src="../../assets/images/copyright.png" width="15px" />
        </div>
        <div class="wrapper__copyright__description">
          МГТУ им. Н. Э. Баумана, 2010-2018. Сайт содержит материалы, охраняемые авторским правом.
          Если не указано иное, содержание этой страницы доступно по лицензии Creative Commons «Attribution-NonCommercial-NoDerivatives» 4.0,
          а примеры кода – по лицензии Apache 2.0. Подробнее см. Условия использования
        </div>
      </div>
    </div>
  </footer>
</template>


<script>
export default {
  name: "Footer",
  components: {}
};
</script>


<style scoped lang="scss">
.filter {
  filter: invert(99%) sepia(22%) saturate(7499%) hue-rotate(318deg)
    brightness(102%) contrast(101%);
}

.footer {
  background: #091928;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wrapper {
  max-width: 1140px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  margin-top: 20px;

  &__cafedra {
    display: flex;
    padding-top: 10px;
    padding-left: 40px;
    align-items: center;
    justify-content: space-between;

    &__name {
      color: #ffd04b;
      font-size: 17pt;
      margin-right: auto;
    }

    &__social_wrapper {
      display: flex;
      justify-content: space-around;
      width: 10%;
    }
  }

  &__copyright {
    display: flex;
    margin-top: 20px;
    padding-left: 10px;
    max-width: calc(100%-15px);
    align-items: center;

    &__icon {
      padding: 5px;
      filter: invert(72%) sepia(3%) saturate(21%) hue-rotate(0deg) brightness(85%) contrast(93%);
    }

    &__description {
      margin-left: 5px;
      color: #9b9b9b;
    }
  }
}
</style>
