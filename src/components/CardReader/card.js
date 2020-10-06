export function evil(fn) {
  var Fn = Function
  return new Fn('return ' + fn)()
}

export const createXmlHttp = () => {
  var xmlHttp = null
  if (window.ActiveXObject) {
    const ActiveXObject = window.ActiveXObject
    xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')
  } else if (window.XMLHttpRequest) {
    const XMLHttpRequest = window.XMLHttpRequest
    xmlHttp = new XMLHttpRequest()
  }
  return xmlHttp
}

export function IDCertCtl() {
  var CertCtl = {}
  CertCtl.xhr = createXmlHttp()
  CertCtl.type = 'CertCtl'
  CertCtl.height = 0
  CertCtl.width = 0
  CertCtl.connect = () => {
    var result = ''

    try {
      CertCtl.xhr.open('POST', 'http://127.0.0.1:18889/api/connect', false)
      CertCtl.xhr.send()
    } catch (e) { }

    if (CertCtl.xhr.readyState === 4 && CertCtl.xhr.status === 200) {
      result = CertCtl.xhr.responseText
    }

    return result
  }

  CertCtl.getStatus = () => {
    var result = ''

    try {
      CertCtl.xhr.open('POST', 'http://127.0.0.1:18889/api/getStatus', false)
      CertCtl.xhr.send()
    } catch (e) { }

    if (CertCtl.xhr.readyState === 4 && CertCtl.xhr.status === 200) {
      result = CertCtl.xhr.responseText
    }

    return result
  }

  CertCtl.readICCardSN = () => {
    var result = ''

    try {
      CertCtl.xhr.open('POST', 'http://127.0.0.1:18889/api/readICCardSN', false)
      CertCtl.xhr.send()
    } catch (e) { }

    if (CertCtl.xhr.readyState === 4 && CertCtl.xhr.status === 200) {
      result = CertCtl.xhr.responseText
    }

    return result
  }

  return CertCtl
}
