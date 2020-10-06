import $ from 'jquery'

export const WebVideoCtrl = window.WebVideoCtrl

export function getChannelInfo(szDeviceIdentify, func) {
  WebVideoCtrl.I_GetAnalogChannelInfo(szDeviceIdentify, {
    async: false,
    success: function (xmlDoc) {
      var oChannels = $(xmlDoc).find('VideoInputChannel')
      var rlists = []
      $.each(oChannels, function (i) {
        rlists.push({
          id: $(this).find('id').eq(0).text(),
          name: $(this).find('name').eq(0).text(),
          bZero: false
        })
      })

      func(rlists)
    }
  })

  WebVideoCtrl.I_GetDigitalChannelInfo(szDeviceIdentify, {
    async: false,
    success: function (xmlDoc) {
      var oChannels = $(xmlDoc).find('InputProxyChannelStatus')
      var rlists = []
      $.each(oChannels, function (i) {
        var isAdd = $(this).find('online').eq(0).text()
        if (isAdd === 'true') {
          rlists.push({
            id: $(this).find('id').eq(0).text(),
            name: $(this).find('name').eq(0).text(),
            bZero: false
          })
        }
      })

      func(rlists)
    }
  })

  WebVideoCtrl.I_GetZeroChannelInfo(szDeviceIdentify, {
    async: false,
    success: function (xmlDoc) {
      var oChannels = $(xmlDoc).find('ZeroVideoChannel')
      var rlists = []
      $.each(oChannels, function (i) {
        var isAdd = $(this).find('enabled').eq(0).text()
        if (isAdd === 'true') {
          rlists.push({
            id: $(this).find('id').eq(0).text(),
            name: $(this).find('name').eq(0).text(),
            bZero: true
          })
        }
      })

      func(rlists)
    }
  })
}

export function clickRecordSearch(szDeviceIdentify, data, func) {
  const iSearchTimes = data.iSearchTimes
  const iChannelID = data.iChannelID
  const szStartTime = data.szStartTime
  const szEndTime = data.szEndTime

  WebVideoCtrl.I_RecordSearch(szDeviceIdentify, iChannelID, szStartTime, szEndTime, {
    iStreamType: 1,
    iSearchPos: iSearchTimes * 40,
    success: function (xmlDoc) {
      alert('szDeviceIdentify=' + szDeviceIdentify)
      alert('iChannelID=' + iChannelID)
      alert('g_iSearchTimes=' + iSearchTimes)
      alert(xmlDoc)

      var rlists = []
      const statusStrg = $(xmlDoc).find('responseStatusStrg').eq(0).text()
      var iLength = $(xmlDoc).find('searchMatchItem').length
      for (var i = 0; i < iLength; i++) {
        var szPlaybackURI = $(xmlDoc).find('playbackURI').eq(i).text()
        if (szPlaybackURI.indexOf('name=') < 0) break
        rlists.push({
          szStartTime: $(xmlDoc).find('startTime').eq(i).text(),
          szEndTime: $(xmlDoc).find('endTime').eq(i).text(),
          szPlaybackURI: szPlaybackURI,
          szFileName: szPlaybackURI.substring(szPlaybackURI.indexOf('name=') + 5, szPlaybackURI.indexOf('&size='))
        })
      }

      alert('iLength=' + iLength)

      if (statusStrg === 'MORE') {
        func(rlists)
      } else if (statusStrg === 'OK') {
        alert(JSON.stringify(rlists))
        func(rlists)
      }
    }
  })
}

export function dateFormat(oDate, fmt) {
  var o = {
    'M+': oDate.getMonth() + 1,
    'd+': oDate.getDate(),
    'h+': oDate.getHours(),
    'm+': oDate.getMinutes(),
    's+': oDate.getSeconds(),
    'q+': Math.floor((oDate.getMonth() + 3) / 3),
    S: oDate.getMilliseconds()
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + '').substr(4 - RegExp.$1.length))
  }

  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }

  return fmt
}
