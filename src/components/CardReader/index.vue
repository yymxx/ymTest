<template>
  <div>
    <el-button v-if="incident=='older'"
      type="primary"
      size="mini"
      @click="readICCardSN()">读卡</el-button>
    <el-button v-if="incident=='order'"
      type="primary"
      icon="el-icon-plus"
      @click="readICCardSN()">刷卡就餐</el-button>
    <object id="CertCtl"
      type="application/cert-reader"
      width="0"
      height="0">
      <object classid="clsid:30516390-004F-40B9-9FC6-C9096B59262E"
        id="CertCtl"
        width="0"
        height="0">
        <object ID="CertCtl"
          classid="30516390-004F-40B9-9FC6-C9096B59262E"
          TYPE="application/cert-reader"
          width=0
          height=0>
        </object>
      </object>
    </object>
  </div>
</template>

<script>
import { IDCertCtl, evil } from './card'
export default {
  name: 'cardReader',
  data() {
    return {
      CertCtl: null
    }
  },
  props: ['incident'],
  created() {},
  mounted() {
    this.CertCtl = new IDCertCtl()
    var result = this.CertCtl.getStatus()
    if (result === '') {
      this.connect(this.CertCtl)
    }
  },
  methods: {
    connect(CertCtl) {
      const that = this
      try {
        var result = CertCtl.connect()
        if (result === '') {
          that.$message.error('开启连接启动报错---未启动读卡插件!')
        } else {
          that.$message({
            type: 'success',
            message: '开启连接启动---成功!'
          })
        }
      } catch (e) {}
    },
    readICCardSN() {
      const that = this
      let CertCtl = this.CertCtl
      try {
        var result = CertCtl.readICCardSN()
        if (result === '') {
          that.$message.error('老年卡未正确读到,请联系管理员')
        } else {
          var json = evil(result)
          var idCardId = json.ICCardSerial
          if (idCardId !== '') {
            that.$emit('setGoback', idCardId)
            that.$message({
              type: 'success',
              message: json.ICCardSerial
            })
          }
        }
      } catch (e) {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
