<template>
  <div class="turn">
    <div class="turn-box">
      <el-table border
        :data="list"
        style="width: 100%;">
        <el-table-column label="姓名"
          prop="oldName"
          align="center">
        </el-table-column>
        <el-table-column label="手机号"
          prop="telephone"
          align="center">
        </el-table-column>
        <el-table-column label="性别"
          prop="sex"
          align="center">
        </el-table-column>
        <el-table-column label="年龄"
          prop="age"
          align="center">
        </el-table-column>
        <el-table-column label="所在社区"
          prop="community"
          align="center">
        </el-table-column>
        <el-table-column label="老人类型"
          prop="personnelType"
          align="center">
        </el-table-column>
      </el-table>
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="呼叫单号"
          prop="wdRemarks">
          <label class="detail">{{ form.callNumber }}</label>
        </el-form-item>
        <el-form-item v-if="callTotype=='in'"
          label="呼叫类型"
          prop="wdRemarks">
          <label class="detail">{{ form.callTypeStr }}</label>
        </el-form-item>
        <el-form-item v-else
          label="呼出类型"
          prop="wdRemarks">
          <label class="detail">{{ form.calloutTypeStr }}</label>
        </el-form-item>
        <el-form-item v-if="callTotype=='in'"
          label="来电时间"
          prop="wdRemarks">
          <label class="detail">{{ form.callTime }}</label>
        </el-form-item>
        <el-form-item v-else
          label="呼出时间"
          prop="wdRemarks">
          <label class="detail">{{ form.calloutTime }}</label>
        </el-form-item>
        <el-form-item v-if="callTotype=='in'"
          label="接线分机"
          prop="wdRemarks">
          <label class="detail">{{ form.exteExtension }}</label>
        </el-form-item>
        <el-form-item v-else
          label="接线分机"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve2 }}</label>
        </el-form-item>
        <el-form-item v-if="callTotype=='in'"
          label="接线坐席"
          prop="wdRemarks">
          <label class="detail">{{ form.exteName }}</label>
        </el-form-item>
        <el-form-item v-else
          label="接线坐席"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve1 }}</label>
        </el-form-item>
        <el-form-item label="通话时长"
          prop="wdRemarks">
          <label class="detail">
            {{ form.talkTime }}
            <el-button type="primary"
              size="mini"
              style="margin-left: 10px;">播放录音</el-button>
          </label>
        </el-form-item>
        <el-tabs v-if="callTotype=='in'&&listRow.callType==3"
          type="card">
          <el-tab-pane label="订单信息">
            <el-form-item label="服务项目"
              prop="wdRemarks">
              <label class="detail">{{ form.reserve3 }}</label>
            </el-form-item>
            <el-form-item label="服务金额"
              prop="wdRemarks">
              <label class="detail">{{ form.wdPrice }}</label>
            </el-form-item>
            <el-form-item label="服务时间"
              prop="wdRemarks">
              <label class="detail">{{ form.sTime }}</label>
            </el-form-item>
            <el-form-item label="紧急程度"
              prop="wdRemarks">
              <label class="detail">{{ form.reserve1 }}</label>
            </el-form-item>
            <el-form-item label="服务站"
              prop="wdRemarks">
              <label class="detail">{{ form.reserve2 }}</label>
            </el-form-item>
            <el-form-item label="服务地址"
              prop="wdRemarks">
              <label class="detail"
                style="width: 620px;">{{ form.sAddress }}</label>
            </el-form-item>
            <el-form-item label="工单备注"
              prop="wdRemarks">
              <label class="detail">{{ form.wdRemarks }}</label>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="callTotype=='in'&&listRow.callType==1"
          type="card">
          <el-tab-pane label="咨询详情">
            <el-form-item label="咨询内容"
              prop="wdRemarks">
              <label class="detail">{{ form.consult }}</label>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="callTotype=='in'&&listRow.callType==2"
          type="card">
          <el-tab-pane label="投诉详情">
            <el-form-item label="投诉类型"
              prop="wdRemarks">
              <label class="detail">{{ form.cpType }}</label>
            </el-form-item>
            <el-form-item label="投诉内容"
              prop="wdRemarks">
              <label class="detail">{{ form.details }}</label>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getRecordList, findByDicCode } from '@/api/page'
import { allApi } from '@/api/call'

const notes = {
  id: null,
  reserve1: '',
  wdClass: 1,
  spId: '',
  wdPrice: '',
  sTime: '',
  state: '',
  stId: '',
  sAddress: '',
  wdRemarks: '',
  spState: '',
  create_user: ''
}

const list = [
  {
    caller: 'hhh'
  }
]

export default {
  name: 'shoutTurn',
  data() {
    return {
      list,
      turnOptions: [],
      listPar: [],
      options: {
        urgent: [],
        serType: [],
        wdState: []
      },
      form: { ...notes },
      rules: {
        dicKey: [
          {
            required: true,
            message: '请输入字典键',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: ['listRow', 'callTotype'],
  created() {
    this.findDicList()
    this.list = [this.listRow]

    let apiUrl = allApi.callmanage.getInById
    if (this.callTotype === 'out') apiUrl = allApi.callmanage.getOutById
    getRecordList(apiUrl, {
      id: this.listRow.id,
      callType: this.listRow.callType
    }).then(response => {
      console.log(222, response)
      if (response.data) {
        this.list = [response.data]
        this.form = response.data
      }
    })
  },
  methods: {
    findDicList() {
      findByDicCode('urgentState').then(response => {
        this.options.urgent = response.data.dataList
      })

      findByDicCode('serviceType').then(response => {
        this.options.serType = response.data.dataList
      })

      findByDicCode('wdState').then(response => {
        this.options.wdState = response.data.dataList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.turn {
  padding: 0 20px;
  margin-bottom: 20px;
  max-height: 500px;
  overflow-y: auto;
  .turn-top {
    .groupbox {
      width: 150px;
      height: 40px;
      float: left;
    }
  }

  .turn-box /deep/ {
    .el-form {
      margin-top: 15px;
      .el-form-item {
        margin-bottom: 0;
        .detail {
          width: 240px;
          display: inline-block;
          font-weight: normal;
        }
      }
    }
  }

  .el-tabs /deep/ {
    margin-top: 10px;
    .is-active {
      color: #fff;
      background-color: #00a1ea;
    }
  }

  .det-footer {
    padding-top: 30px;
    text-align: right;
  }
}
</style>
