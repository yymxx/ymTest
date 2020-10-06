<template>
  <div class="turn">
    <div class="turn-box">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <el-form-item label="姓名"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve2 }}</label>
        </el-form-item>
        <el-form-item label="出生日期"
          prop="wdRemarks">
          <label class="detail">{{ form.birthday }}</label>
        </el-form-item>
        <el-form-item label="联系方式"
          prop="wdRemarks">
          <label class="detail">
            {{ form.telephone }}
            <el-button type="primary"
              size="mini"
              @click="callPhone()"
              style="margin-left: 10px;">拔号</el-button>
          </label>
        </el-form-item>
        <el-form-item label="年龄"
          prop="wdRemarks">
          <label class="detail">{{ form.age }}</label>
        </el-form-item>
        <el-form-item label="居住社区"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve4 }}</label>
        </el-form-item>
        <el-form-item label="性别"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve3 }}</label>
        </el-form-item>
        <el-form-item label="执行人员"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve1 }}</label>
        </el-form-item>
        <el-form-item label="计划时间"
          prop="wdRemarks">
          <label class="detail">{{ form.taskTime }}</label>
        </el-form-item>
        <el-form-item label="提醒时间"
          prop="wdRemarks">
          <label class="detail">{{ form.remindTime }}</label>
        </el-form-item>
        <el-form-item label="任务备注"
          prop="wdRemarks">
          <label class="detail">{{ form.taskRemarks }}</label>
        </el-form-item>
        <el-form-item v-if="listRow.taskStatus==1"
          label="执行报告"
          prop="wdRemarks">
          <label class="detail">{{ form.presentation }}</label>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getRecordList, findByDicCode } from '@/api/page'
import { allApi } from '@/api/call'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['voip'])
  },
  props: ['listRow', 'calltype'],
  created() {
    this.findDicList()
    this.list = [this.listRow]

    console.log(222, this.list)
    let apiUrl = allApi.plan.getById
    getRecordList(apiUrl, {
      id: this.listRow.id
    }).then(response => {
      console.log(222, response)
      if (response.data) {
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
    },
    callPhone() {
      const voip = this.voip
      const that = this
      voip.CallPhone(this.form.telephone, function(data) {
        if (parseInt(data.code) === 0) {
          that.$message({
            type: 'success',
            message: '拔号成功'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.turn {
  padding: 0 20px;
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
