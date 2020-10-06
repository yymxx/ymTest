<template>
  <div class="box hjfx">
    <span class="top"></span>
    <span class="left"></span>
    <span class="right"></span>
    <span class="bottom"></span>
    <div class="txt">
      <h2>呼叫分析</h2>
      <ul>
        <li>
          <span class="orange">{{callgroup.callSumCount?callgroup.callSumCount:0}}</span>
          <span>呼叫总数</span>
        </li>
        <li>
          <span>{{callgroup.callCount?callgroup.callCount:0}}</span>
          <span>呼入次数</span>
        </li>
        <li>
          <span>{{callgroup.calloutCount?callgroup.calloutCount:0}}</span>
          <span>呼出次数</span>
        </li>
      </ul>
      <hr>
      <ul>
        <li>
          <span class="blue">{{callgroup.callSumTime?callgroup.callSumTime:0}}</span>
          <span>呼叫时长</span>
        </li>
        <li>
          <span>{{callgroup.callTime?callgroup.callTime:0}}</span>
          <span>呼入时长</span>
        </li>
        <li>
          <span>{{callgroup.calloutTime?callgroup.calloutTime:0}}</span>
          <span>呼出时长</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {}
  },
  props: ['callgroup'],
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
ul,
ol,
li {
  list-style: none;
}

.box {
  border: 1px solid #3486da;
  background: #022a8f;
  position: relative;
  border-radius: 6px;
}

.box .top {
  position: absolute;
  top: -1px;
  left: -1px;
  background: url('/static/images/large/border1.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

.box .left {
  position: absolute;
  top: -1px;
  right: -1px;
  background: url('/static/images/large/border2.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

.box .right {
  position: absolute;
  bottom: -1px;
  left: -1px;
  background: url('/static/images/large/border3.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

.box .bottom {
  position: absolute;
  bottom: -1px;
  right: -1px;
  background: url('/static/images/large/border4.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

.txt > h2 {
  margin: 15px 0 0 15px;
  font-size: 20px;
  letter-spacing: 1px;
}

.txt > h2:before {
  content: '';
  display: inline-block;
  background: url('/static/images/large/title.png') no-repeat;
  background-size: 100% 100%;
  width: 10px;
  height: 35px;
  vertical-align: middle;
  margin-right: 10px;
}

.hjfx {
  height: 240px;
}

.hjfx ul {
  width: 500px;
  height: 70px;
  margin: 10px auto;
}

.hjfx ul li {
  float: left;
  width: 150px;
}

.hjfx ul li span {
  display: block;
  text-align: center;
  font-size: 16px;
}

.hjfx ul li span:first-child {
  font-size: 28px;
  font-weight: bold;
  margin-top: 5px;
}

.hjfx ul li span.orange {
  color: #bb6d06;
}

.hjfx ul li span.blue {
  color: #4cf2db;
}

.hjfx hr {
  width: 450px;
  margin: 0 auto;
  height: 1px;
  border: none;
  border-top: 1px solid #005edc;
}
</style>
