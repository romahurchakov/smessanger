<template>
  <div class="wrapper">
    <div class="profile">
      <br />
      <dl>
        <dt class="dt">Бакалавриат</dt>
        <dd>Начиная с 2015 года, для поступления на направление подготовки 01.03.02 «Прикладная математика и информатика» установлены следующие вступительные испытания:</dd>
        <br />
        <div class="space">
          <dd>Информатика и ИКТ (1-й приоритет);</dd>
          <dd>Математика (2-й приоритет);</dd>
          <dd>Русский язык (3-й приоритет).</dd>
        </div>
        <br />
        <dd>План приёма на первый курс бакалавриата в 2018 году:</dd>
        <div class="space">
          <dd>на бюджетную основу обучения — 36;</dd>
          <dd>по договорам с оплатой стоимости обучения — 16.</dd>
        </div>
        <dd>Проходные баллы прошлых лет по общему конкурсу на бюджетные места:</dd>
        <br />
        <div class="space">
          <dd>в 2015 г. — 255 баллов;</dd>
          <dd>в 2016 г. — 266 баллов;</dd>
          <dd>в 2017 г. — 277 баллов.</dd>
        </div>
        <br />
        <dt class="dt">Магистратура</dt>
        <dd>На кафедре ИУ-9 реализуется магистерская программа Компьютерная алгебра, лингвистика и биоинформатика в рамках направления подготовки 01.04.04 «Прикладная математика».</dd>
        <dd>В 2018 году для поступления установлено вступительное испытание по дисциплине:</dd>
        <br>
        <div class="space">
          <dd>Дифференциальные уравнения.</dd>
        </div>
        <br>
        <dd>План приёма на первый курс магистратуры в 2018 году:</dd>
        <br>
        <div class="space">
          <dd>на бюджетную основу обучения — 10;</dd>
          <dd>по договорам с оплатой стоимости обучения — 5.</dd>
        </div>
        <br>
        <dd>Вопросы можно задавать: Скоробогатову Сергею Юрьевичу или Голубкову Артёму Юрьевичу по адресу: iu9 @ – “собака” bmstu точка* ru</dd>
      </dl>
    </div>
  </div>
</template>



<script>
export default {
  name: "Abitura",
  components: {}
};
</script>


<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile {
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  margin-left: 10%;
  margin-right: 10%;

  .dt {
    font-weight: 700;
    font-size: 16pt;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  dd {
    line-height: 18pt;
  }

  ul {
    display: block;
    list-style-type: disc;
    margin-top: 1em;
    margin-bottom: 1 em;
    margin-left: 0;
    margin-right: 0;
    padding-left: 40px;
    line-height: 18pt;
  }

  li {
    margin-bottom: 7px;
    margin-top: 10px;
    line-height: 18pt;
  }

  .space {
    padding-left: 15px;
  }
}
</style>
