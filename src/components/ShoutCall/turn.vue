<template>
  <div class="turn">
    <div class="turn-top">
      <el-radio-group disabled
        v-model="numValue">
        <div class="groupbox"
          v-for="(item, index) in turnOptions"
          :key="index">
          <el-radio :label="item.dicKey">{{item.dicValue}}</el-radio>
        </div>
        <div style="clear: both;"></div>
      </el-radio-group>
    </div>
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
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="110px">
        <div v-show="num==1">
          <el-form-item label="咨询详情"
            prop="consult">
            <el-input type="textarea"
              :rows="5"
              v-model="form.consult"
              placeholder="请输入咨询详情"
              style="width: 560px;"></el-input>
          </el-form-item>
        </div>
        <div v-show="num==2">
          <el-form-item label="投诉类型"
            prop="cpType">
            <el-select class="filter-item"
              clearable
              v-model="form.cpType"
              placeholder="请选择"
              style="width: 220px">
              <el-option v-for="item in options.cpType"
                :key="item.val"
                :label="item.dataKey"
                :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="投诉详情"
            prop="details">
            <el-input type="textarea"
              :rows="5"
              v-model="form.details"
              placeholder="请输入投诉详情"
              style="width: 560px;"></el-input>
          </el-form-item>
        </div>
        <div v-show="num==3">
          <el-form-item label="服务时间"
            prop="sTime">
            <el-date-picker type="datetime"
              v-model="form.sTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期"
              style="width: 220px">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="服务类型"
            prop="spState">
            <el-select class="filter-item"
              clearable
              v-model="form.spState"
              placeholder="请选择"
              @change="handleTypes"
              style="width: 220px">
              <el-option v-for="item in options.serType"
                :key="item.val"
                :label="item.dataKey"
                :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目/服务站"
            prop="stId">
            <el-cascader clearable
              filterable
              v-model="listPar"
              :options="stationTree"
              @change="handleParents"
              style="width: 220px"></el-cascader>
          </el-form-item>
          <el-form-item label="紧急程度"
            prop="state">
            <el-select class="filter-item"
              clearable
              v-model="form.state"
              placeholder="请选择"
              style="width: 220px">
              <el-option v-for="item in options.urgent"
                :key="item.val"
                :label="item.dataKey"
                :value="item.val"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务金额"
            prop="wdPrice">
            <el-input readonly
              v-model="form.wdPrice"
              style="width: 220px;"></el-input>
          </el-form-item>
          <el-form-item label="工单备注"
            prop="wdRemarks">
            <el-input type="textarea"
              v-model="form.wdRemarks"
              placeholder="请输入工单备注"
              style="width: 220px;"></el-input>
          </el-form-item>
          <el-form-item label="服务地址"
            prop="sAddress">
            <el-input v-model="form.sAddress"
              placeholder="请输入服务地址"
              style="width: 450px;"></el-input>
            <span class="seat-map"
              @click="handleAddress()">
              <svg-icon icon-class="seat"></svg-icon>
              <span>选择地址</span>
            </span>
          </el-form-item>
        </div>
      </el-form>
      <div class="det-footer">
        <div slot="footer"
          class="dialog-footer">
          <el-button @click="cancel('form')">取 消</el-button>
          <el-button type="primary"
            @click="update('form')">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getRecordList, findByDicCode } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

const notes = {
  id: null,
  cid: '',
  zxid: 1,
  callTime: '',
  callType: '',
  consult: '',
  cpType: '',
  details: '',
  spId: '',
  wdPrice: '',
  spState: '',
  sTime: '',
  state: '',
  stId: '',
  sAddress: '',
  wdRemarks: '',
  create_user: ''
}

const turnOptions = [
  {
    dicKey: 1,
    dicValue: '咨询'
  },
  {
    dicKey: 2,
    dicValue: '投诉'
  },
  {
    dicKey: 3,
    dicValue: '工单'
  }
]

export default {
  name: 'shoutTurn',
  data() {
    return {
      list: [],
      turnOptions,
      listPar: [],
      stationTree: [],
      options: {
        urgent: [],
        serType: [],
        wdState: [],
        cpType: []
      },
      numValue: 1,
      form: { ...notes },
      rules: {
        sTime: []
      }
    }
  },
  props: ['num', 'listMsg', 'myEvent'],
  computed: {
    ...mapGetters(['sysUser'])
  },
  created() {
    this.findDicList()
    this.numValue = this.num
    const apiUrl = allApi.orderrecord.station
    getRecordList(apiUrl, {
      spState: 3
    }).then(response => {
      this.stationTree = response.data
    })
  },
  mounted() {
    this.rules.sTime = []
    if (this.num === 3) {
      this.rules.sTime.push({
        required: true,
        message: '请输入',
        trigger: 'blur'
      })
    }

    this.list = [this.listMsg]
    this.form.cid = this.listMsg.id
    this.form.callType = this.num
    this.myEvent.$on('setSiteback', res => {
      this.form.sAddress = res.address
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

      findByDicCode('cpType').then(response => {
        this.options.cpType = response.data.dataList
      })

      findByDicCode('wdState').then(response => {
        this.options.wdState = response.data.dataList
      })
    },
    handleParents() {
      this.form.wdPrice = this.stationTree.reduce((total, item) => {
        if (item.value === this.listPar[0]) return item.spPrice
        return total
      }, 0)
      this.form.spId = this.listPar[0]
      this.form.stId = this.listPar[1]
    },
    handleTypes(val) {
      console.log(val)
      const apiUrl = allApi.orderrecord.station
      getRecordList(apiUrl, {
        spState: val
      }).then(response => {
        this.stationTree = response.data
      })
    },
    handleAddress() {
      this.$emit('setSite', '')
    },
    update(formName) {
      this.form.create_user = this.sysUser.id
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('setGoback', this.form)
        } else {
          return false
        }
      })
    },
    cancel(formName) {
      this.$emit('setGoback', null)
      console.log(this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.turn {
  padding: 0 20px;
  .turn-top {
    .groupbox {
      width: 150px;
      height: 40px;
      float: left;
    }
  }

  .turn-box {
    .el-form {
      margin-top: 30px;
    }
  }

  .det-footer {
    padding-top: 30px;
    text-align: right;
  }
}
</style>
