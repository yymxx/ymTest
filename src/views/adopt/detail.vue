<template>
  <div class="detail-filter">
    <el-table border
      :data="list"
      style="width: 100%;margin-bottom: 20px;">
      <el-table-column label="姓名"
        prop="oldName"
        align="center">
      </el-table-column>
      <el-table-column label="手机号"
        prop="telephone"
        align="center">
      </el-table-column>
      <el-table-column label="性别"
        prop="sexStr"
        align="center">
      </el-table-column>
      <el-table-column label="年龄"
        prop="age"
        align="center">
      </el-table-column>
      <el-table-column label="所在社区"
        prop="reserve4"
        align="center">
      </el-table-column>
      <el-table-column label="老人类型"
        prop="personnelTypeStr"
        align="center">
      </el-table-column>
    </el-table>
    <table width="100%"
      cellpadding="0"
      cellspacing="0"
      border="1"
      class="detail-table">
      <tr v-for="(row, num) in basics"
        :key="num">
        <td v-for="(item, index) in row"
          :key="index"
          :colspan="getColspan(row, index)">
          <div v-if="index%2==1"
            class="td-box">
            <span>{{ form[item] }}</span>
          </div>
          <div v-else
            class="td-center">
            <span>{{ item }}</span>
          </div>
        </td>
      </tr>
    </table>
    <el-tabs type="card">
      <el-tab-pane label="回访记录">
        <table width="100%"
          cellpadding="0"
          cellspacing="0"
          border="1"
          class="detail-table">
          <tr v-for="(row, num) in basics"
            :key="num">
            <td v-for="(item, index) in row"
              :key="index"
              :colspan="getColspan(row, index)">
              <div v-if="index%2==1"
                class="td-box">
                <span>{{ form[item] }}</span>
              </div>
              <div v-else
                class="td-center">
                <span>{{ item }}</span>
              </div>
            </td>
          </tr>
        </table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
const notes = {
  id: null,
  oldName: '哈哈哈',
  gender: '女',
  idNumber: '12345666666666696'
}

export default {
  name: 'publicDetail',
  data() {
    return {
      list: [
        {
          oldName: '哈哈哈'
        }
      ],
      form: { ...notes },
      basics: [
        ['老人姓名', 'oldName', '性别', 'gender'],
        ['老人姓名', 'oldName', '性别', 'gender'],
        ['老人姓名', 'oldName', '性别', 'gender'],
        ['身份证号', 'idNumber']
      ]
    }
  },
  props: ['rowData'],
  created() {
    console.log(this.rowData)
    if (this.rowData) this.list = [this.rowData]
  },
  methods: {
    getColspan(row, index) {
      let num = 1
      if (row.length < 3 && index === 1) num = 3
      return num
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-filter {
  padding: 0 15px;
  height: 500px;
  overflow-y: auto;
  .el-tabs /deep/ {
    .is-active {
      color: #fff;
      background-color: #00a1ea;
    }
  }

  .detail-table /deep/ {
    border-color: #fff;
    margin-bottom: 15px;
    td {
      min-width: 80px;
      .td-box {
        padding: 12px 20px;
      }

      .td-center {
        line-height: 40px;
        text-align: center;
      }
    }
  }
}
</style>
