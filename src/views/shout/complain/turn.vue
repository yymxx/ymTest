<template>
  <div class="turn">
    <div class="turn-box">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="120px">
        <el-form-item label="投诉人姓名"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve1 }}</label>
        </el-form-item>
        <el-form-item label="联系电话"
          prop="wdRemarks">
          <label class="detail">
            {{ form.telephone }}
            <el-button type="primary"
              size="mini"
              @click="callPhone()"
              style="margin-left: 10px;">拔号</el-button>
          </label>
        </el-form-item>
        <el-form-item label="处理状态"
          prop="wdRemarks">
          <label class="detail">{{ form.handleTypeStr }}</label>
        </el-form-item>
        <el-form-item label="坐席名字"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve3 }}</label>
        </el-form-item>
        <el-form-item label="坐席工号"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve2 }}</label>
        </el-form-item>
        <el-form-item label="投诉类型"
          prop="wdRemarks">
          <label class="detail">{{ form.cpTypeStr }}</label>
        </el-form-item>
        <el-form-item label="来电时间"
          prop="wdRemarks">
          <label class="detail">{{ form.reserve4 }}</label>
        </el-form-item>
        <el-form-item label="投诉详情"
          prop="wdRemarks">
          <label class="detail">{{ form.details }}</label>
        </el-form-item>
        <el-form-item v-if="listRow.handleType==1"
          label="处理结果"
          prop="wdRemarks">
          <label class="detail">{{ form.handleResult }}</label>
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

    console.log(222, this.listRow)
    let apiUrl = allApi.complaint.getById
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
  position: relative;
  top: -30px;
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
