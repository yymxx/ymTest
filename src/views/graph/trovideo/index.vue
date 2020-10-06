<template>
  <div class="main-container">
    <el-row :gutter="20">
      <el-col :span="10">
        <div class="sp-wrapper">
          <div id="divPlugin"
            class="plugin"
            v-loading="loading"
            element-loading-text="请用IE浏览器打开"
            element-loading-background="rgba(0, 0, 0, 0.8)"></div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="filter-container">
          <div class="select">
            <div class="type">通道列表</div>
            <el-select placeholder="请选择"
              v-model="activeSign">
              <el-option v-for="item in equOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </div>
          <el-button type="primary"
            @click="clickStartRealPlay()">查看摄像头</el-button>
          <el-button type="primary"
            @click="clickStopRealPlay()">停止查看</el-button>
        </div>
        <div class="filter-container">
          <div class="time-editor">
            <el-date-picker v-model="timeQuerys"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>
          <el-button type="primary"
            icon="el-icon-search"
            @click="handleQuery(0)">查询</el-button>
        </div>
        <div style="height: 500px;overflow-y: auto;">
          <el-table border
            :data="list"
            style="width: 100%;">
            <el-table-column width="60"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="视频文件"
              prop="szFileName"
              align="center">
            </el-table-column>
            <el-table-column label="开始时间"
              prop="szStartTime"
              align="center">
            </el-table-column>
            <el-table-column label="结束时间"
              prop="szEndTime"
              align="center">
            </el-table-column>
            <el-table-column label="操作"
              align="center"
              width="150">
              <template slot-scope="scope">
                <el-button type="primary"
                  size="mini"
                  @click="downloadRecord(scope.row)">下载</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bofang">
          <el-button type="primary"
            size="mini"
            @click="clickStartPlayback()">开始回放</el-button>
          <el-button type="primary"
            size="mini"
            @click="clickStopPlayback()">停止回放</el-button>
          <el-button type="primary"
            size="mini"
            @click="clickReversePlayback()">倒放</el-button>
          <el-button type="primary"
            size="mini"
            @click="clickPause()">暂停</el-button>
          <el-button type="primary"
            size="mini"
            @click="clickResume()">恢复</el-button>
          <el-button type="primary"
            size="mini"
            @click="clickPlaySlow()">慢放</el-button>
          <el-button type="primary"
            size="mini"
            @click="clickPlayFast()">快放</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  WebVideoCtrl,
  getChannelInfo,
  clickRecordSearch,
  dateFormat
} from './demo'

export default {
  name: 'HelloWorld',
  data() {
    return {
      list: [],
      iWndIndex: 0,
      oPort: null,
      iWndwebsite: '',
      basicWidth: '500px',
      btnPowers: null,
      loading: false,
      timeQuerys: [],
      equOptions: [
        {
          id: 1,
          name: '正和电子',
          bZero: true
        }
      ],
      activeSign: 1
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)
  },
  mounted() {
    const that = this
    window.screenWidth = document.body.clientWidth
    that.basicWidth = ((window.screenWidth - 238) / 12 * 5).toFixed(1) + 'px'
    if (parseInt(that.basicWidth) < 493) that.basicWidth = '493px'
    that.loading = true

    const szCurTime = dateFormat(new Date(), 'yyyy-MM-dd')
    that.timeQuerys = [szCurTime + ' 00:00:00', szCurTime + ' 23:59:59']

    console.log(WebVideoCtrl)
    this.videoInitPlugin({
      loginip: '192.168.1.64',
      szPort: '80',
      name: 'admin',
      password: 'ZH123456'
    })
  },
  methods: {
    videoInitPlugin(obj) {
      const that = this
      var iRet = WebVideoCtrl.I_CheckPluginInstall()
      console.log('iRet', iRet)

      WebVideoCtrl.I_InitPlugin(this.basicWidth, 600, {
        bWndFull: true,
        iPackageType: 2,
        iWndowType: 2,
        bNoPlugin: true,
        cbInitPluginComplete: function() {
          WebVideoCtrl.I_InsertOBJECTPlugin('divPlugin')
          console.log(WebVideoCtrl.I_CheckPluginVersion())
          that.loading = false

          const loginip = obj.loginip
          const szPort = obj.szPort
          WebVideoCtrl.I_Login(loginip, 1, szPort, obj.name, obj.password, {
            success: function(xmlDoc) {
              that.iWndwebsite = loginip + '_' + szPort
              setTimeout(function() {
                that.equOptions = []
                getChannelInfo(that.iWndwebsite, res => {
                  that.equOptions = that.equOptions.concat(res)
                })

                that.oPort = WebVideoCtrl.I_GetDevicePort(that.iWndwebsite)
              }, 10)

              setTimeout(function() {
                that.clickStartRealPlay()
                WebVideoCtrl.I_ChangeWndNum(1)
              }, 50)
            }
          })
        }
      })
    },
    handleQuery(iType) {
      const that = this
      const row = this.equOptions.find(item => item.id === this.activeSign)
      let bZeroChannel = false
      if (row) bZeroChannel = row.bZero
      if (!bZeroChannel) {
        clickRecordSearch(
          that.iWndwebsite,
          {
            iSearchTimes: 0,
            iChannelID: that.activeSign,
            szStartTime: that.timeQuerys[0],
            szEndTime: that.timeQuerys[1]
          },
          res => {
            that.list = res
          }
        )
      }
    },
    clickStartRealPlay() {
      const that = this
      const szDeviceIdentify = that.iWndwebsite
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      var startRealPlay = function() {
        WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
          iRtspPort: null,
          iStreamType: 1,
          iChannelID: that.activeSign,
          bZeroChannel: false
        })
      }

      if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
          success: function() {
            startRealPlay()
          }
        })
      } else {
        startRealPlay()
      }
    },
    clickStopRealPlay() {
      const that = this
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
          success: function() {
            console.log('停止预览成功！')
          }
        })
      }
    },
    downloadRecord(row) {
      console.log(row)
      const szDeviceIdentify = this.iWndwebsite
      var iDownloadID = WebVideoCtrl.I_StartDownloadRecord(
        szDeviceIdentify,
        row.szPlaybackURI,
        row.szFileName,
        {
          bDateDir: true
        }
      )

      console.log(iDownloadID)
    },
    clickStartPlayback() {
      const that = this
      const szDeviceIdentify = that.iWndwebsite
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      var startPlayback = function() {
        WebVideoCtrl.I_StartPlayback(szDeviceIdentify, {
          iRtspPort: null,
          iStreamType: 1,
          iChannelID: that.activeSign,
          szStartTime: that.timeQuerys[0],
          szEndTime: that.timeQuerys[1],
          success: function() {
            console.log('开始回放成功！')
          }
        })
      }

      if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
          success: function() {
            startPlayback()
          }
        })
      } else {
        startPlayback()
      }
    },
    clickStopPlayback() {
      const that = this
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
          success: function() {
            console.log('停止回放成功！')
          }
        })
      }
    },
    clickReversePlayback() {
      const that = this
      const szDeviceIdentify = that.iWndwebsite
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      var reversePlayback = function() {
        var iRet = WebVideoCtrl.I_ReversePlayback(szDeviceIdentify, {
          iRtspPort: null,
          iStreamType: 1,
          iChannelID: that.activeSign,
          szStartTime: that.timeQuerys[0],
          szEndTime: that.timeQuerys[1]
        })

        if (iRet === 0) {
          console.log('开始倒放成功！')
        }
      }

      if (oWndInfo != null) {
        WebVideoCtrl.I_Stop({
          success: function() {
            reversePlayback()
          }
        })
      } else {
        reversePlayback()
      }
    },
    clickPause() {
      const that = this
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      if (oWndInfo != null) {
        WebVideoCtrl.I_Pause({
          success: function() {
            console.log('暂停成功！')
          }
        })
      }
    },
    clickResume() {
      const that = this
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      if (oWndInfo != null) {
        WebVideoCtrl.I_Resume({
          success: function() {
            console.log('恢复成功！')
          }
        })
      }
    },
    clickPlaySlow() {
      const that = this
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      if (oWndInfo != null) {
        WebVideoCtrl.I_PlaySlow({
          success: function() {
            console.log('慢放成功！')
          }
        })
      }
    },
    clickPlayFast() {
      const that = this
      var oWndInfo = WebVideoCtrl.I_GetWindowStatus(that.iWndIndex)
      if (oWndInfo != null) {
        WebVideoCtrl.I_PlayFast({
          success: function() {
            console.log('快放成功！')
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sp-wrapper {
  background: url('/static/images/sp.png') left center no-repeat;
  background-size: 100% 100%;
  .plugin {
    width: 100%;
    height: 600px;
  }
}

.bofang {
  text-align: center;
  margin-top: 20px;
}
</style>
