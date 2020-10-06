<template>
  <div>
    <div class="sheet-detail">
      <el-form :inline="true"
        :model="form"
        ref="form"
        label-width="135px">
        <el-form-item label="工单编号：">
          <label class="detail">{{ form.wdNum }}</label>
        </el-form-item>
        <el-form-item label="工单状态：">
          <label class="detail">{{ form.reserve3 }}</label>
        </el-form-item>
        <table width="100%"
          cellpadding="0"
          cellspacing="0"
          border="1"
          class="apply-table">
          <tr v-for="(row, num) in basics.note"
            :key="num">
            <td>
              <div class="td-center">{{ row[1] }}</div>
            </td>
            <td>
              <div class="td-box">
                <span>{{ form[row[0]] }}</span>
              </div>
            </td>
            <td>
              <div class="td-center">{{ row[3] }}</div>
            </td>
            <td>
              <div class="td-box">
                <span>{{ form[row[2]] }}</span>
              </div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="td-center">服务站</div>
            </td>
            <td colspan="3">
              <div class="td-box">
                <span>{{ form.ssName }}</span>
              </div>
            </td>
          </tr>
        </table>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getRecordById } from '@/api/page'
import { allApi } from '@/api/config'

const notes = {
  id: null,
  oldName: '666',
  idNumber: '9999'
}

const basics = {
  note: [
    ['oldName', '老人姓名', 'reserve4', '性别'],
    ['telephone', '联系电话', 'age', '年龄'],
    ['spContent', '服务项目', 'wdPrice', '服务金额'],
    ['sTime', '服务时间', 'reserve1', '下单方式'],
    ['sAddress', '服务地址', 'reserve2', '下单人'],
    ['plState', '紧急程度', 'applyTime', '下单时间']
  ],
  give: [
    ['ssName', '服务站', 'heName', '服务人员'],
    ['actualStartTime', '签到时间', 'signInAddress', '签到地址'],
    ['actualEndTime', '签出时间', 'signOutAddress', '签出地址']
  ],
  visit: [
    ['rvTime', '回访时间', 'reserve5', '回访方式'],
    ['visitUser', '回访人', 'rvSatisfaction', '服务评分']
  ]
}

export default {
  name: 'sheetDetail',
  data() {
    return {
      basics,
      form: { ...notes }
    }
  },
  props: ['rowData'],
  created() {
    console.log(this.rowData)
    const apiUrl = allApi.workorder.getById
    getRecordById(apiUrl, this.rowData.id).then(response => {
      console.log(222, response)
      this.form = response.data
      this.form.oldName = response.data.customer.oldName
      this.form.telephone = response.data.customer.telephone
      this.form.age = response.data.customer.age
      this.form.ssName = response.data.servicestation.ssName
      this.form.heName = response.data.helpelderly.heName
      this.form.rvContent = response.data.returnvisit.rvContent
      this.form.rvTime = response.data.returnvisit.rvTime
      this.form.rvSatisfaction = response.data.returnvisit.rvSatisfaction
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.sheet-detail {
  position: relative;
  top: -10px;
  padding: 0 42px;
  .el-form-item {
    margin-bottom: 10px;
    .detail {
      width: 240px;
      display: inline-block;
    }
  }

  .el-tabs /deep/ {
    .is-active {
      color: #fff;
      background-color: #00a1ea;
    }
  }

  .apply-table /deep/ {
    border-color: #fff;
    margin-bottom: 12px;
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
