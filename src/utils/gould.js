import AMap from 'AMap'
import { Message } from 'element-ui'

let map = null
let geocoder = null

export function initAMap(tainer, tipinput, func) {
  map = new AMap.Map(tainer, {
    resizeEnable: true,
    zoom: 11,
    center: [114.264669, 30.549972]
  })

  AMap.event.addListener(
    new AMap.Autocomplete({
      input: tipinput,
      city: '武汉市',
      datatype: 'poi',
      citylimit: true
    }),
    'select',
    function (res) {
      console.log('location', res.poi.location)
      let lnglat = [res.poi.location.lng, res.poi.location.lat]
      map.add(
        new AMap.Marker({
          icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
          position: lnglat
        })
      )
    }
  )

  map.on('click', function (e) {
    let lnglat = [e.lnglat.getLng(), e.lnglat.getLat()]
    let marker = new AMap.Marker({
      icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
      position: lnglat
    })

    map.add(marker)
    geocoder = new AMap.Geocoder({
      radius: 1000
    })

    geocoder.getAddress(lnglat, function (status, result) {
      if (status === 'complete' && result.regeocode) {
        var address = result.regeocode.formattedAddress
        console.log(address)
        func({
          address: address,
          lnglat: lnglat.join()
        })
      } else {
        Message({
          message: '根据经纬度查询地址失败',
          type: 'warning'
        })
      }
    })
  })
}
