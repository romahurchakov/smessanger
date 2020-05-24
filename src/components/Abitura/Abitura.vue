<template>
  <div class="wrapper">
    <div class="profile">
      <br />
      <dl>
        <dt class="dt">Бакалавриат</dt>
        <dd>Начиная с 2015 года, для поступления на направление подготовки 01.03.02 «Прикладная математика и информатика» установлены следующие вступительные испытания:</dd>
        <div class="flex-container">
          <div class="vl" />
          <div>
            <dd>Информатика и ИКТ (1-й приоритет);</dd>
            <dd>Математика (2-й приоритет);</dd>
            <dd>Русский язык (3-й приоритет).</dd>
          </div>
        </div>

        <dd>План приёма на первый курс бакалавриата в 2018 году:</dd>
        <div class="flex-container">
          <div class="vl" />
          <div>
            <dd>
              на
              <span style="font-weight:bold">бюджетную</span> основу обучения —
              <span style="font-weight:bold">36</span>;
            </dd>
            <dd>
              по договорам
              <span style="font-weight:bold">с оплатой стоимости</span> обучения —
              <span style="font-weight:bold">16</span>.
            </dd>
          </div>
        </div>
        <dd>Проходные баллы прошлых лет по общему конкурсу на бюджетные места:</dd>
        <div class="flex-container">
          <div class="vl" />
          <div>
            <dd>
              в 2015 г. —
              <span style="font-weight:bold">255</span> баллов;
            </dd>
            <dd>
              в 2016 г. —
              <span style="font-weight:bold">266</span> баллов;
            </dd>
            <dd>
              в 2017 г. —
              <span style="font-weight:bold">277</span> баллов.
            </dd>
          </div>
        </div>
        <br />
        <dt class="dt">Магистратура</dt>
        <dd>На кафедре ИУ-9 реализуется магистерская программа Компьютерная алгебра, лингвистика и биоинформатика в рамках направления подготовки 01.04.04 «Прикладная математика».</dd>
        <dd>В 2018 году для поступления установлено вступительное испытание по дисциплине:</dd>
        <div class="flex-container">
          <div class="vl" />
          <dd>Дифференциальные уравнения.</dd>
        </div>
        <dd>План приёма на первый курс магистратуры в 2018 году:</dd>
        <div class="flex-container">
          <div class="vl" />
          <div>
            <dd>на бюджетную основу обучения — 10;</dd>
            <dd>по договорам с оплатой стоимости обучения — 5.</dd>
          </div>
        </div>
        <dd>
          Вопросы можно задавать: Скоробогатову Сергею Юрьевичу или Голубкову Артёму Юрьевичу по адресу:
          <span style="font-weight:bold">iu9@bmstu.ru</span>
        </dd>
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

  .vl {
    border-left: 4px solid #ffd04b;
    border-radius: 4px;
    margin-right: 10px;
  }

  .flex-container {
    display: flex;
    margin-bottom: 10px;
    margin-top: 8px;
  }
}
</style>
