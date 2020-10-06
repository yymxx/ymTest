let websock = null
const webStates = ['正在连接', '已建立连接', '正在关闭连接', '已关闭连接']

function sendSock(agentData, callback) {
  websock = new WebSocket('ws://192.168.1.104:8260/sockjs-node/websocket')
  websock.onopen = function () {
    console.log('Socket状态：' + webStates[websock.readyState])
    websock.send(JSON.stringify(agentData))
  }

  websock.onmessage = function (e) {
    console.log('返回的数据：' + e.data)
    callback(JSON.parse(e.data))
  }

  websock.onerror = function () {
    console.log('WebSocket连接发生错误')
  }

  websock.onclose = function (e) {
    console.log('connection closed：' + e.code)
  }
}

export { sendSock }
