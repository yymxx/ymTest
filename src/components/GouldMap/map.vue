<template>
  <div>
    <div>
      <div id="allmap"
        style="width: 100%;"
        :style="{height: mapHeight}"></div>
    </div>
    <div v-if="clickModal!=false"
      class="mapbtn">
      <el-button type="primary"
        size="mini"
        @click="initAMap()">初始化地图</el-button>
      <el-button type="primary"
        size="mini"
        @click="setAmapStyle()">设置地图风格</el-button>
    </div>

    <el-dialog title="经纬度"
      :visible.sync="dialogFormVisible"
      @close="clearFormValidate('form')"
      :close-on-click-modal="false"
      width="420px">
      <el-form :inline="true"
        :model="form"
        :rules="rules"
        ref="form"
        label-width="90px">
        <el-form-item label="经度"
          prop="getLng">
          <el-input v-model="form.getLng"
            placeholder="请输入经度"
            style="width: 240px;"></el-input>
        </el-form-item>
        <el-form-item label="纬度"
          prop="getLat">
          <el-input v-model="form.getLat"
            placeholder="请输入纬度"
            style="width: 240px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel('form')">取 消</el-button>
        <el-button type="primary"
          @click="update('form')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import MapLoader from './loader'

export default {
  name: 'gouldMap',
  data() {
    return {
      map: null,
      city: '',
      mapHeight: '520px',
      geocoder: null,
      point: [114.264669, 30.549972],
      isOpenLocation: false,
      dialogFormVisible: false,
      form: {
        getLng: '',
        getLat: ''
      },
      rules: {
        getLng: [
          {
            required: true,
            message: '请输入经度',
            trigger: 'blur'
          }
        ],
        getLat: [
          {
            required: true,
            message: '请输入经度',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  props: ['clickModal', 'data', 'height'],
  watch: {
    data(newVal, oldVal) {
      const that = this
      if (this.height) this.mapHeight = this.height
      MapLoader('408cabdb96f3e63c06535bc956d8878d').then(AMap => {
        that.map = new AMap.Map('allmap', {
          resizeEnable: true,
          zoom: 11,
          center: [113.957052, 30.508385]
        })

        that.MarkerOnAdds(AMap, newVal)
      })
    }
  },
  mounted() {
    const that = this
    if (this.height) this.mapHeight = this.height
    MapLoader('408cabdb96f3e63c06535bc956d8878d').then(AMap => {
      that.map = new AMap.Map('allmap', {
        resizeEnable: true,
        zoom: 11,
        center: [113.957052, 30.508385]
      })

      if (that.data) that.MarkerOnAdds(AMap, that.data)
    })
  },
  methods: {
    initAMap(AMap) {
      this.map.destroy()
      this.map = new AMap.Map('allmap', {
        resizeEnable: true,
        zoom: 11,
        center: [114.264669, 30.549972]
      })

      this.openGetLocation()
    },
    MarkerOnAdds(AMap, lists) {
      const map = this.map
      for (let item of lists) {
        let lnglat = item.longitudeLatitude.split(',')
        let marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: lnglat
        })

        this.map.add(marker)
        marker.setLabel({
          offset: new AMap.Pixel(20, 20),
          content: item.orgTypeStr
        })

        marker.on('click', function(e) {
          var info = []
          info.push('<img src="https://webapi.amap.com/images/autonavi.png"/>')
          info.push(item.orgName)
          info.push('联系人：' + item.contacts + '，' + item.contactsMode)
          info.push('坐标为：' + e.target.getPosition())
          let infoWindow = new AMap.InfoWindow({
            content: info.join('<br/>'),
            offset: new AMap.Pixel(0, -35)
          })

          infoWindow.open(map, e.target.getPosition())
        })
      }
    },
    setAmapStyle() {
      this.map.setMapStyle('amap://styles/darkblue')
    },
    openGetLocation() {
      this.isOpenLocation = true
      this.map.on('click', this.clickHandler)
    },
    closeGetLocation() {
      this.isOpenLocation = false
      this.map.off('click', this.clickHandler)
    },
    clickHandler(e) {},
    openInfoWindow(AMap) {
      const map = this.map
      let marker = new AMap.Marker({
        icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: this.point
      })

      map.add(marker)
      marker.on('click', function(e) {
        var info = ['<img src="https://webapi.amap.com/images/autonavi.png"/>']
        info.push('坐标为：' + e.target.getPosition())
        let infoWindow = new AMap.InfoWindow({
          content: info.join('<br/>'),
          offset: new AMap.Pixel(0, -35)
        })

        infoWindow.open(map, e.target.getPosition())
      })
    },
    bmapLocTOAmapLoc(AMap) {
      const map = this.map
      let lnglat = [114.271677, 30.556054]
      AMap.convertFrom(lnglat, 'baidu', function(status, result) {
        if (result.info === 'ok') {
          var resLnglat = result.locations[0]
          let marker = new AMap.Marker({
            icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            position: resLnglat
          })

          map.add(marker)
          marker.setLabel({
            offset: new AMap.Pixel(20, 20),
            content: '百度地图转化之后的钟家村'
          })
        }
      })
    },
    update(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
        } else {
          return false
        }
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.mapbtn {
  text-align: center;
  padding-top: 10px;
  .el-button {
    margin-top: 10px;
  }
}

.amap-sug-result {
  z-index: 3020;
}
</style>
