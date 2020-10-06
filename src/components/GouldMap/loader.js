export default function MapLoader(key) {
  return new Promise((resolve, reject) => {
    var lists = document.getElementsByTagName('script')
    for (let object of lists) {
      if (object.src.indexOf('webapi.amap.con') !== -1) {
        object.parentNode.removeChild(object)
      }
    }

    var script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://webapi.amap.com/maps?v=1.4.15&callback=initAMap&key=' + key + '&plugin=AMap.Geocoder&plugin=AMap.Autocomplete'
    script.onerror = reject
    document.body.appendChild(script)

    window.initAMap = () => {
      resolve(window.AMap)
    }
  })
}
