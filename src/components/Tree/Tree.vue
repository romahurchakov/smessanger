<template>
  <div style="width: 100%; display:flex; flex-direction: column; align-items: center; margin-top: 20px;">
    <h1 class="title">Дерево отчётов</h1>
    <div class="block">
      <el-tree :data="data" node-key="id" default-expand-all :expand-on-click-node="false">
        <span class="custom-tree-node" slot-scope="{ node }" style="height: 30px;">
          <span>{{ node.label }}</span>
          <span style="margin-left: 20px;">
            <icon class="el-icon-download"></icon>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    const data = [
      {
        id: 1,
        label: "Алгоритмы компьютерной графики",
        children: [
          {
            id: 4,
            label: '№4 "алгоритмы растровой развертки"',
            children: [
              {
                id: 9,
                label: "Студент_1_отчет.py"
              },
              {
                id: 10,
                label: "Студент_3_отчет.pdf"
              }
            ]
          },
          {
            id: 4,
            label: '№3 "алгоритмы растровой развертки"',
            children: [
              {
                id: 9,
                label: "Студент_1_отчет.py"
              },
              {
                id: 10,
                label: "Студент_3_отчет.pdf"
              }
            ]
          }
        ]
      },
      {
        id: 2,
        label: "Компиляторы",
        children: [
          {
            id: 4,
            label: '№2 "LL(1) грамматика"',
            children: [
              {
                id: 9,
                label: "Студент_1_отчет.cpp"
              },
              {
                id: 10,
                label: "Студент_2_отчет.pdf"
              }
            ]
          }
        ]
      }
    ];
    return {
      data: JSON.parse(JSON.stringify(data))
    };
  }
};
</script>

<style>
.block {
  width: 65%;
  margin-top: 20px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  height: 40px;
  font-weight: 900;
  font-family: Arial, Helvetica, sans-serif;
}
</style>