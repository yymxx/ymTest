import md5 from 'js-md5'
import $ from 'jquery'

export function getNowTimes() {
  var mydate = new Date()
  return mydate.getTime()
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

export function GetRandomNum(Min, Max) {
  var Range = Max - Min
  var Rand = Math.random()
  return Min + Math.round(Rand * Range)
}

export function getJsonP(url, parms, callback) {
  $.getJSON(url, parms, function (data) {
    callback(data)
  })
}

export function evil(fn) {
  var Fn = Function
  return new Fn('return ' + fn)()
}

export function VoipCall() {
  var oVoip = {}
  oVoip.userSession = ''
  oVoip.userName = ''
  oVoip.userPass = ''
  oVoip.extension = ''
  oVoip.exteId = 0
  oVoip.compId = 0
  oVoip.lastWatertime = getNowTimes()
  oVoip.Waterline = 0
  oVoip.CallBack_Call = null
  oVoip.CallBack_Answer = null
  oVoip.CallBack_HangUp = null
  oVoip.CallBack_login = null
  oVoip.CallBack_status = null
  oVoip.CallBack_Key = null
  oVoip.CallUserInfo = null
  oVoip.ShowMsg = null
  oVoip.status = 2
  oVoip.kind = 1
  oVoip.oldUser = null
  oVoip.lineId = GetRandomNum(100, 21323322)
  oVoip.phone = null

  oVoip.init = function (url) {
    oVoip.serviceUrl = url
  }

  oVoip.TransferUser = function (phone, func) {
    var url = oVoip.getUrl(oVoip.userName, oVoip.userPass, 'transferExten')
    getJsonP(url, { descExten: phone }, function (data) {
      func(data)
    })
  }

  oVoip.setUserCheckInOut = function (aStatus, fun) {
    var url = oVoip.getUrl(
      oVoip.userName,
      oVoip.userPass,
      'setUserCheckInOut'
    )
    getJsonP(url, { status: aStatus }, function (data) {
      fun(data)
    })
  }

  oVoip.CallPhone = function (phone, func) {
    if (phone === null || phone.length < 3) {
      return
    }
    var url = oVoip.getUrl(oVoip.userName, oVoip.userPass, 'callbackPhone')
    url += '&paramvalue=' + '111'
    getJsonP(
      url,
      { sourcePhone: oVoip.userName, descPhone: phone },
      function (data) {
        func(data)
      }
    )
  }

  oVoip.hangup = function (phone, func) {
    var url = oVoip.getUrl(oVoip.userName, oVoip.userPass, 'hangupExten')
    getJsonP(url, { phoneNum: phone }, function (data) {
      func(data)
    })
  }

  oVoip.userlogin = function (userName, userpass) {
    var url = oVoip.getUrl(userName, userpass, 'getExtension')
    getJsonP(url, {}, function (data) {
      if (parseInt(data.code) === 0) {
        oVoip.userSession = data.sessionId
        oVoip.exteId = data.exteId
        oVoip.compId = data.compId
        oVoip.lineId = data.loginLine
        oVoip.extension = data.extension.substr(0, 6)
        oVoip.userName = userName
        oVoip.userPass = userpass
        oVoip.CallBack_login(0, '')
        oVoip.getLongWaterLine()
        oVoip.getLoadmonitor()
      } else {
        oVoip.userSesson = ''
        oVoip.exteId = 0
        oVoip.compId = 0
        oVoip.userName = ''
        oVoip.userPass = ''
        oVoip.CallBack_login(1, data.message)
      }
    })
  }

  oVoip.getLoadmonitor = function () {
    var url =
      oVoip.serviceUrl +
      'voip/extensionmanager/loadmonitor.jsonp?callback=?&sessionId=' +
      oVoip.userSession +
      '&extension=' +
      oVoip.userName
    getJsonP(url, {}, function (data) {
      if (parseInt(data.code) === 0 && data.rows !== null && data.rows.length > 0) {
        oVoip.CallBack_status(data.rows[0])
      }
      setTimeout(function () {
        oVoip.getLoadmonitor()
      }, 60000)
    })
  }

  oVoip.getLongWaterLine = function () {
    oVoip.lastWatertime = getNowTimes()
    var url = oVoip.getUrl(
      oVoip.userName,
      oVoip.userPass,
      'getLongWaterLine'
    )
    getJsonP(
      url,
      { client: 1, message: 1, loginLine: oVoip.lineId },
      function (data) {
        if (data !== null && parseInt(data.code) === 0) {
          if (data.waterline > oVoip.Waterline) {
            if (oVoip.Waterline === 0) {
              oVoip.Waterline = data.waterline - 1
            }
            if (data.msgs !== null) {
              oVoip.HandleMsg(data.msgs)
            }
          }
          if (data.userInfo !== null) {
            oVoip.CallUserInfo(oVoip.oldUser, data.userInfo)
            oVoip.oldUser = data.userInfo
          }
          if (data && oVoip.CallBack_Key && data.keylist) {
            oVoip.CallBack_Key(data.keylist)
          }
        }
        oVoip.getLongWaterLine()
      }
    )
  }

  oVoip.getMsgList = function () {
    var url = oVoip.getUrl(oVoip.userName, oVoip.userPass, 'recvMsg')
    var aLimit = 9876
    if (oVoip.Waterline > 0) {
      aLimit = 5
    }
    getJsonP(
      url,
      { waterLine: oVoip.Waterline, client: 1, limit: aLimit },
      function (data) {
        if (parseInt(data.code) === 0 && data.msgs !== null && data.msgs.length > 0) {
          oVoip.HandleMsg(data.msgs)
        }
      }
    )
  }

  oVoip.HandleMsg = function (msg) {
    var Waterline = 0
    if (!msg) return
    for (var i = 0; i < msg.length; i++) {
      var obj = msg[i]
      var slastrecvMsgTime = obj.waterLine
      if (slastrecvMsgTime > oVoip.Waterline) {
        if (
          Waterline < slastrecvMsgTime &&
          obj.phone !== null &&
          obj.phone !== ''
        ) {
          Waterline = slastrecvMsgTime
        }
        var status = 0
        var cdrId = 0
        try {
          const context = evil(obj.content)
          cdrId = context.cdrId
          if (context.status !== undefined) {
            status = parseInt(context.status)
          }
        } catch (err) { }
        if (obj.kind === 1 || obj.kind === 2) {
          if (oVoip.phone !== obj.phone) {
            if (status === 0) {
              oVoip.CallBack_Call(obj.kind, obj.phone)
              oVoip.phone = obj.phone
              oVoip.kind = obj.kind
              oVoip.status = 0
            }
          } else if (oVoip.status !== status) {
            switch (status) {
              case 0:
                oVoip.CallBack_Call(obj.kind, obj.phone)
                oVoip.phone = obj.phone
                oVoip.kind = obj.kind
                oVoip.status = 0
                break
              case 1:
                oVoip.CallBack_Answer(obj.kind, obj.phone)
                break
              case 2:
                oVoip.getHandUpMsg(obj.phone, oVoip.kind, cdrId)
                break
            }
            oVoip.status = status
          }
        } else if (obj.kind > 2 && oVoip.ShowMsg !== null) {
          oVoip.ShowMsg(obj)
        }
      }
    }
    if (Waterline > oVoip.Waterline) {
      oVoip.Waterline = Waterline
    }
  }

  oVoip.getHandUpMsg = function (phone, kind, aCdrId) {
    if (aCdrId === -1) {
      var obj = {}
      obj.cdrId = aCdrId
      obj.cdrPeer = kind
      oVoip.CallBack_HangUp(kind, phone, obj)
    } else {
      var url = oVoip.getUrl(
        oVoip.userName,
        oVoip.userPass,
        'findDialrecord'
      )
      if (phone !== null && phone.length < 5) {
        phone = oVoip.extension + phone
      }
      getJsonP(
        url,
        {
          phoneNum: phone,
          limit: 1,
          extension: oVoip.userName,
          scdrId: aCdrId
        },
        function (data) {
          var obj = {}
          if (parseInt(data.code) === 0 && data.rows !== null && data.rows.length > 0) {
            obj = data.rows[0]
            oVoip.CallBack_HangUp(kind, phone, obj)
          } else {
            obj = {}
            obj.cdrId = aCdrId
            obj.cdrPeer = kind
            oVoip.CallBack_HangUp(kind, phone, obj)
          }
        }
      )
    }
  }

  oVoip.answerPhone = function (phone, func) {
    var url = oVoip.getUrl(oVoip.userName, oVoip.userPass, 'sendMsg')
    getJsonP(
      url,
      { phone: phone, kind: 6, client: 1, lostTime: 10 },
      function (data) {
        func(data)
      }
    )
  }

  oVoip.StopPhone = function (phone, func) {
    var url = oVoip.getUrl(oVoip.userName, oVoip.userPass, 'sendMsg')
    getJsonP(
      url,
      { phone: phone, kind: 7, client: 1, lostTime: 10 },
      function (data) {
        func(data)
      }
    )
  }

  oVoip.getChannelList = function (func) {
    var url = oVoip.getUrl(oVoip.userName, oVoip.userPass, 'getChannelList')
    getJsonP(url, { queueSize: 1 }, function (data) {
      func(data)
    })
  }

  oVoip.getUrl = function (user, pass, funcname) {
    var url = oVoip.serviceUrl +
      'voip/api/jsonpdata.jsonp?callback=?&method=' + funcname +
      '&sa_user=' + user + '&sa_password=' + md5(pass) + '&loginType=jsonpLogin'
    return url
  }

  oVoip.timeoutevent = function () {
    var aTime = getNowTimes()
    if (oVoip.exteId !== 0 && aTime - oVoip.lastWatertime > 1000 * 35) {
      oVoip.getLongWaterLine()
    }
  }

  setInterval(oVoip.timeoutevent, 1000)

  return oVoip
}
