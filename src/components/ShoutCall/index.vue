<template>
  <div>
    <!-- <el-input v-model="phoneno"
      placeholder="请输入外呼号码"
      onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
      style="width: 240px;margin-right: 12px;"
      maxlength="11"></el-input>
    <el-button type="warning"
      @click="callPhone()"
      plain>拔号</el-button> -->
    <el-button type="warning"
      @click="handleCreate()"
      style="margin-right: 12px;"
      plain>手动录入工单</el-button>
    <el-dialog width="1200px"
      title="来电弹屏"
      :visible.sync="dialogIsIncome"
      @close="dialogCallClose()"
      :close-on-click-modal="false">
      <div class="call-wrapper">
        <div class="top clearfix">
          <div class="lf">来电信息</div>
          <div class="rh">
            <!-- <el-button v-if="isAnswer"
              type="primary"
              size="small"
              @click="answerPhone()">接听</el-button>
            <el-button v-else
              type="info"
              size="small">接听</el-button>
            <el-button type="primary"
              size="small"
              @click="hangup()">挂机</el-button> -->
          </div>
        </div>
        <div class="top clearfix">
          <div class="lf">来电号码
            <span v-if="!isManual"
              class="tel-num"> {{ inphone }} </span>
            <span v-else
              style="margin-left: 8px;">
              <el-input v-model="inphone"
                placeholder="请输入手机号"
                style="width: 240px;margin-right: 12px;"></el-input>
              <el-button type="primary"
                icon="el-icon-search"
                @click="handleQuery(inphone)">查询</el-button>
            </span>
          </div>
          <div class="rh"
            v-if="callInfo">
            <el-button type="primary"
              size="small"
              @click="transfer(1)">转咨询</el-button>
            <el-button type="primary"
              size="small"
              @click="transfer(2)">转投诉</el-button>
            <el-button type="primary"
              size="small"
              @click="transfer(3)">转工单</el-button>
          </div>
        </div>
        <el-row :gutter="15">
          <el-col :span="15">
            <table width="100%"
              cellpadding="0"
              cellspacing="0"
              border="1"
              class="apply-table">
              <tr v-for="(row, num) in basics"
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
            </table>
            <el-tabs type="card">
              <el-tab-pane label="紧急联系人">
                <el-table border
                  :data="form.relativesList"
                  style="width: 100%;">
                  <el-table-column label="姓名"
                    prop="relName"
                    align="center">
                  </el-table-column>
                  <el-table-column label="关系"
                    prop="reserve1"
                    align="center">
                  </el-table-column>
                  <el-table-column label="联系电话"
                    prop="relPhone"
                    align="center">
                  </el-table-column>
                  <el-table-column label="操作"
                    align="center"
                    width="150">
                    <template slot-scope="scope">
                      <el-button type="primary"
                        :icon="iconTel"
                        @click="handleDetail(scope.row)">拨打</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="9">
            <div id="allmap"
              style="width: 100%;height: 420px;"></div>
          </el-col>
        </el-row>
        <el-tabs type="card"
          style="margin-top: 12px;">
          <el-tab-pane label="通话记录">
            <shout-ring :list="form.callmanageList"></shout-ring>
          </el-tab-pane>
        </el-tabs>
        <el-tabs type="card"
          style="margin-top: 12px;">
          <el-tab-pane label="工单记录">
            <shout-order :list="form.workorderList"></shout-order>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-dialog>

    <el-dialog width="800px"
      title="来电记录"
      :visible.sync="dialogIsTurn"
      @close="dialogTurnClose()"
      :close-on-click-modal="false">
      <shout-turn v-if="dialogIsTurn"
        :num="turnNum"
        :listMsg="form"
        :myEvent="siteEvent"
        @setSite="handleAddress"
        @setGoback="handleTurnback"></shout-turn>
    </el-dialog>

    <el-dialog width="800px"
      title="点击地图选择地址"
      :visible.sync="dialogMapShow"
      @close="dialogMapClose()"
      :close-on-click-modal="false">
      <gould-map v-if="dialogMapShow"
        :myEvent="siteEvent"
        @setGoback="handleMapback"></gould-map>
    </el-dialog>
  </div>
</template>

<script>
import { VoipCall, dateFormat } from './voip'
import { mapGetters } from 'vuex'
import gouldMap from '@/components/GouldMap'
import shoutRing from './phone'
import shoutOrder from './order'
import shoutTurn from './turn'
import { getRecordList, updateRecord } from '@/api/page'
import { allApi } from '@/api/call'
import Vue from 'vue'

const basics = [
  ['oldName', '老人姓名', 'idNumber', '身份证号'],
  ['sexStr', '性别', 'age', '年龄'],
  ['personnelTypeStr', '老人类型', 'currentAddress', '现住址'],
  ['reserve1', '服务中心', 'reserve2', '地址']
]

export default {
  name: 'shoutCall',
  components: {
    gouldMap,
    shoutRing,
    shoutOrder,
    shoutTurn
  },
  data() {
    return {
      basics,
      phoneno: '',
      inphone: '13597454716',
      isAnswer: 'init',
      callInfo: false,
      turnNum: 0,
      callTime: '',
      siteEvent: new Vue(),
      isManual: false,
      dialogIsTurn: false,
      dialogMapShow: false,
      dialogIsIncome: false,
      iconTel: 'el-icon-phone',
      form: {
        name: '666',
        relativesList: [],
        callrecordList: [],
        workorderList: []
      },
      list: [
        {
          type: '111'
        },
        {
          type: '111'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['voip', 'sysUser'])
  },
  created() {
    this.$store.dispatch('SetNewVoip', new VoipCall())
  },
  mounted() {
    let userName = '102630801'
    console.log('sysUser', this.sysUser)
    if (this.sysUser.userName.indexOf('1026308') !== -1) {
      console.log('userName', this.sysUser.userName)
      userName = this.sysUser.userName
    }

    this.init(this.voip)
    const voip = this.voip
    voip.init('http://120.202.177.95:8081/')
    setTimeout(function() {
      voip.userlogin(userName, userName)
    }, 1000)

    this.handleQuery(this.inphone)
  },
  methods: {
    init(voip) {
      const that = this
      voip.CallBack_login = function(code, message) {
        if (code === 0) {
          that.$message({
            type: 'success',
            message: '初始化登录成功'
          })
        } else {
          that.$message.error('初始化登录失败')
        }
      }

      voip.CallBack_status = function(data) {
        console.log('用户名称:' + data.exteName, '设备状态:' + data.statustext)
      }

      voip.CallUserInfo = function(olduser, newuser) {
        console.log('olduser', olduser)
        console.log('newuser', newuser)
      }

      voip.CallBack_Call = function(kind, phone) {
        if (kind === 2) {
          console.log('来电号码：' + phone)
          that.inphone = phone
          that.isAnswer = true
          that.dialogIsIncome = true
          that.handleQuery(phone)
        } else {
          console.log('呼出号码：' + phone)
          that.inphone = phone
          that.isAnswer = false
          that.dialogIsIncome = true
          that.handleQuery(phone)
        }
      }

      voip.CallBack_Answer = function(kind, phone) {
        if (kind === 2) {
          console.log('呼入接听' + phone)
        } else {
          console.log('呼出接听' + phone)
        }
      }

      voip.CallBack_HangUp = function(kind, phone, obj) {
        let peer = obj.cdrPeer === 2 ? '呼入' : '呼出'
        // console.log(peer, obj.cdrPhoneArea)
        // console.log('接听时间：', obj.cdrSucessTime)
        console.log('录音文件：', obj.cdrRecordFile)
        console.log(peer, obj.cdrTalktime)
        that.callTime = obj.cdrHangupTime
      }
    },
    callPhone() {
      const voip = this.voip
      const that = this
      if (this.phoneno.length < 3) this.$message.error('请输入有效电话号码')
      voip.CallPhone(this.phoneno, function(data) {
        if (parseInt(data.code) === 0) {
          that.$message({
            type: 'success',
            message: '拔号成功'
          })
        }
      })
    },
    answerPhone() {
      const voip = this.voip
      const that = this
      voip.answerPhone(this.inphone, function(data) {
        if (parseInt(data.code) === 0) {
          that.isAnswer = false
          that.$message({
            type: 'success',
            message: '接听成功'
          })
        }
      })
    },
    hangup() {
      const voip = this.voip
      const that = this
      voip.hangup(this.inphone, function(data) {
        if (parseInt(data.code) === 0) {
          that.isAnswer = true
          that.$message({
            type: 'success',
            message: '挂机成功'
          })
        }
      })
    },
    handleCreate() {
      this.isManual = true
      this.dialogIsIncome = true
      this.inphone = ''
      this.callInfo = false
      this.form = {
        name: '',
        relativesList: [],
        callrecordList: [],
        workorderList: []
      }
    },
    handleQuery(tel) {
      getRecordList(allApi.getByTel, {
        telephone: tel
      }).then(response => {
        console.log('tel', response)
        this.form = response.data
        try {
          let AMap = window.AMap
          let map = new AMap.Map('allmap', {
            resizeEnable: true,
            zoom: 11,
            center: [113.957052, 30.508385]
          })

          let marker = new AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position: [113.957052, 30.508385]
          })

          map.add(marker)
        } catch (e) {}

        if (this.form && typeof this.form !== 'string') {
          this.callInfo = true
        } else {
          this.callInfo = false
        }
      })
    },
    transfer(num) {
      this.dialogIsTurn = true
      this.turnNum = num
    },
    handleDetail(row) {},
    handleAddress() {
      this.dialogMapShow = true
    },
    handleMapback(data) {
      this.dialogMapShow = false
    },
    handleTurnback(data) {
      this.dialogIsTurn = false
      if (data === null) return
      let obj = data
      // obj.callTime = this.callTime
      const date = new Date()
      date.setTime(date.getTime() - 60 * 2000)
      obj.callTime = dateFormat(date, 'yyyy-MM-dd hh:mm:ss')
      console.log('form', obj)
      const apiUrl = allApi.callmanage.addCallIn
      updateRecord(apiUrl, obj).then(res => {
        console.log('callmanage', res)
        if (res.data > 0) {
          this.dialogIsIncome = false
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        } else {
          if (res.msg !== '') {
            this.$message({
              type: 'warning',
              message: res.msg
            })
          }
        }
      })
    },
    dialogMapClose() {
      this.dialogMapShow = false
    },
    dialogTurnClose() {
      this.dialogIsTurn = false
      this.dialogMapShow = false
    },
    dialogCallClose() {
      this.dialogIsIncome = false
      this.dialogIsTurn = false
      this.dialogMapShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
.call-wrapper {
  position: relative;
  top: -20px;
  padding: 0 25px;
  height: 600px;
  overflow-y: auto;
  .top {
    padding: 16px 0;
    font-size: 18px;
    &:first-child {
      border-bottom: 1px solid #c9c9c9;
    }

    .lf {
      float: left;
      line-height: 32px;
      .tel-num {
        position: relative;
        font-weight: bold;
        margin-left: 8px;
        color: red;
        font-size: 24px;
        animation: myfirst 0.3s linear 0s infinite alternate;
      }
    }

    .rh {
      float: right;
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

  .el-tabs /deep/ {
    .is-active {
      color: #fff;
      background-color: #00a1ea;
    }
  }
}

@keyframes myfirst {
  from {
    top: -2px;
    left: 3px;
  }
  to {
    background: yellow;
  }
}
</style>
