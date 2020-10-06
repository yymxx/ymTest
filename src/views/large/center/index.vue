<template>
  <div>
    <total :oldcount="oldcount"
      :mantotal="mantotal"
      :atcount="atcount"
      :stcount="stcount"
      :fwcount="fwcount"
      :citySubsidy="citySubsidy"
      :SubsidyCount="SubsidyCount"
      :hjtotal="hjtotal"></total>
    <div v-if="isGould"
      class="large-map"
      style="padding: 18px 26px 0;">
      <div id="container"
        style="width: 100%;height: 660px;"></div>
    </div>
    <mapbox v-else></mapbox>
  </div>
</template>

<script>
import total from './total'
import mapbox from './map'
import AMap from 'AMap'

export default {
  name: 'HelloWorld',
  components: {
    total,
    mapbox
  },
  props: [
    'oldcount',
    'mantotal',
    'atcount',
    'stcount',
    'fwcount',
    'citySubsidy',
    'SubsidyCount',
    'hjtotal'
  ],
  data() {
    return {
      map: null,
      isGould: true
    }
  },
  mounted() {
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      zoom: 12,
      center: [113.981428, 30.497533],
      mapStyle: 'amap://styles/darkblue'
    })

    // this.map.setMapStyle('amap://styles/darkblue')
    this.MarkerOnAdds([
      {
        longitudeLatitude: '113.981428,30.497533',
        orgTypeStr: '蔡甸街'
      },
      {
        longitudeLatitude: '113.944349,30.567641',
        orgTypeStr: '蔡甸街'
      }
    ])
  },
  methods: {
    MarkerOnAdds(lists) {
      const map = this.map
      for (let item of lists) {
        let lnglat = item.longitudeLatitude.split(',')
        let marker = new AMap.Marker({
          icon: '/static/images/marker.png',
          position: lnglat
        })

        map.add(marker)
        marker.setLabel({
          offset: new AMap.Pixel(0, 30),
          content: '<div class="my-label">' + item.orgTypeStr + '</div>'
        })

        marker.on('click', function(e) {
          var info = []
          info.push('<img src="https://webapi.amap.com/images/autonavi.png"/>')
          info.push(item.orgTypeStr)
          info.push('老人：')
          info.push('服务：')
          let infoWindow = new AMap.InfoWindow({
            content: info.join('<br/>'),
            offset: new AMap.Pixel(35, -35)
          })

          infoWindow.open(map, e.target.getPosition())
        })
      }

      map.setFitView()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
