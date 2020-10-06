<template>
  <div>
    <div class="map-box">
      <div class="filter-container">
        <el-input id="nickName"
          class="filter-input"
          v-model="city"
          name="keyword"
          placeholder="请输入搜索条件"
          style="width: 360px;margin-right: 20px;">
          <template slot="prepend">关键字</template>
        </el-input>
      </div>
      <div id="tainer"
        style="width: 100%;height: 430px;"></div>
    </div>
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
  props: ['clickModal', 'myEvent'],
  mounted() {
    const that = this
    MapLoader('408cabdb96f3e63c06535bc956d8878d').then(AMap => {
      that.map = new AMap.Map('tainer', {
        resizeEnable: true,
        zoom: 11,
        center: [113.981428, 30.497533]
      })

      that.openGetLocation(AMap)

      const temp = new AMap.Autocomplete({
        input: 'nickName',
        city: '武汉市',
        datatype: 'poi',
        citylimit: true
      })

      AMap.event.addListener(temp, 'select', function(res) {
        let address = res.poi.district + res.poi.address
        let lnglat = [res.poi.location.lng, res.poi.location.lat]
        that.map.setZoomAndCenter(13, lnglat)

        let marker = new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: lnglat
        })

        that.map.add(marker)
        marker.on('click', function(e) {
          that.$emit('setGoback', {
            address: address,
            lnglat: lnglat.join()
          })

          if (that.myEvent) {
            that.myEvent.$emit('setSiteback', {
              address: address,
              lnglat: lnglat.join()
            })
          }
        })
      })
    })
  },
  methods: {
    initAMap(AMap) {
      this.map.destroy()
      this.map = new AMap.Map('tainer', {
        resizeEnable: true,
        zoom: 11,
        center: [113.981428, 30.497533]
      })

      this.openGetLocation()
    },
    setAmapStyle() {
      this.map.setMapStyle('amap://styles/darkblue')
    },
    openGetLocation(AMap) {
      this.isOpenLocation = true
      const that = this
      this.map.on('click', e => {
        let lnglat = [e.lnglat.getLng(), e.lnglat.getLat()]
        console.log(lnglat)
        that.geocoder = new AMap.Geocoder({
          radius: 1000
        })

        that.geocoder.getAddress(lnglat, function(status, result) {
          if (status === 'complete' && result.regeocode) {
            var address = result.regeocode.formattedAddress
            that
              .$confirm('你选择的地址是：' + address, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
              .then(() => {
                that.$emit('setGoback', {
                  address: address,
                  lnglat: lnglat.join()
                })

                if (that.myEvent) {
                  that.myEvent.$emit('setSiteback', {
                    address: address,
                    lnglat: lnglat.join()
                  })
                }
              })
          } else {
            that.$message({
              type: 'warning',
              message: '根据经纬度查询地址失败'
            })
          }
        })
      })
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

.map-box {
  padding-bottom: 10px;
}

.amap-sug-result {
  z-index: 3020;
}
</style>
