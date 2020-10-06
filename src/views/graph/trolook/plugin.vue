<template>
  <div class="sp-wrapper">
    <div :id="divId"
      class="plugin"
      v-loading="loading"
      element-loading-text="请用IE浏览器打开"
      element-loading-background="rgba(0, 0, 0, 0.8)"></div>
  </div>
</template>

<script>
import { WebVideoCtrl } from '../../../../static/webVideoCtrl.js'

export default {
  name: 'webPlugin',
  data() {
    return {
      loading: false,
      boxId: 'divPlugin',
      basicWidth: '500px'
    }
  },
  props: ['divId'],
  mounted() {
    const that = this
    window.screenWidth = document.body.clientWidth
    that.basicWidth = ((window.screenWidth - 435) / 3).toFixed(2) + 'px'
    if (parseInt(that.basicWidth) < 325) that.basicWidth = '325px'
    that.loading = true

    console.log(this.divId, that.basicWidth)
    this.videoInitPlugin(this.divId)
  },
  methods: {
    videoInitPlugin(divId) {
      const that = this
      var iRet = WebVideoCtrl.I_CheckPluginInstall()
      console.log('iRet', iRet)
      var oLiveView = {
        iProtocol: 1,
        szIP: '192.168.1.64',
        szPort: '80',
        szUsername: 'admin',
        szPassword: 'ZH123456',
        iStreamType: 1,
        iChannelID: 1,
        bZeroChannel: false
      }

      WebVideoCtrl.I_InitPlugin(this.basicWidth, 375, {
        bWndFull: true,
        iWndowType: 1,
        cbInitPluginComplete: function() {
          WebVideoCtrl.I_InsertOBJECTPlugin(divId)
          console.log(WebVideoCtrl.I_CheckPluginVersion())
          that.loading = false

          WebVideoCtrl.I_Login(
            oLiveView.szIP,
            oLiveView.iProtocol,
            oLiveView.szPort,
            oLiveView.szUsername,
            oLiveView.szPassword,
            {
              success: function(xmlDoc) {
                var szDeviceIdentify = oLiveView.szIP + '_' + oLiveView.szPort
                setTimeout(function() {
                  WebVideoCtrl.I_StartRealPlay(szDeviceIdentify, {
                    iStreamType: oLiveView.iStreamType,
                    iChannelID: oLiveView.iChannelID,
                    bZeroChannel: oLiveView.bZeroChannel
                  })
                }, 1000)
              }
            }
          )
        }
      })
    }
  },
  destroyed() {
    WebVideoCtrl.I_Stop()
  }
}
</script>

<style lang="scss" scoped>
.sp-wrapper {
  background: url('/static/images/sp.png') left center no-repeat;
  background-size: 100% 100%;
  .plugin {
    width: 100%;
    height: 375px;
  }
}
</style>
