<template>
  <div class="total_box">
    <ul>
      <li>
        <p>
          <img src="/static/images/large/icon1.png">
        </p>
        <div>
          <span>老人总数</span>
          <span>{{oldcount}}</span>
          <span>老龄化占比{{oldcount?parseInt(oldcount / mantotal * 100):0}}%</span>
        </div>
      </li>
      <li>
        <p>
          <img src="/static/images/large/icon2.png">
        </p>
        <div>
          <span>服务次数</span>
          <span>{{fwcount}}</span>
        </div>
      </li>
      <li>
        <p>
          <img src="/static/images/large/icon3.png">
        </p>
        <div>
          <span>呼叫次数</span>
          <span>{{hjtotal}}</span>
        </div>
      </li>
      <li>
        <p>
          <img src="/static/images/large/icon4.png">
        </p>
        <div>
          <span>补助对象</span>
          <span>{{atcount}}</span>
          <span>补助对象占比{{atcount?(atcount / mantotal * 100).toFixed(1):0}}%</span>
        </div>
      </li>
      <li>
        <p>
          <img src="/static/images/large/icon5.png">
        </p>
        <div>
          <span>补助发放</span>
          <span>{{SubsidyCount}}
            <i class="money">元</i>
          </span>
          <span>补助使用率{{citySubsidy?(citySubsidy / SubsidyCount * 100).toFixed(1):0}}%</span>
        </div>
      </li>
      <li>
        <p>
          <img src="/static/images/large/icon6.png">
        </p>
        <div>
          <span>服务站</span>
          <span>{{stcount}}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {}
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
  mounted() {},
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

.total_box {
  width: 100%;
  height: 220px;
  margin-top: 10px;
}

.total_box ul {
  padding: 0;
  margin-left: 35px;
}

.total_box ul li {
  float: left;
  width: 305px;
  height: 110px;
}

.total_box ul li p {
  display: inline-block;
  width: 80px;
  height: 80px;
  border-radius: 40px;
  text-align: center;
  line-height: 80px;
  margin-right: 10px;
  margin-left: 20px;
}

.total_box ul li p img {
  vertical-align: middle;
}

.total_box ul li:nth-child(1) p {
  background: #0080ff;
}

.total_box ul li:nth-child(2) p {
  background: #ff3600;
}

.total_box ul li:nth-child(3) p {
  background: #00a196;
}

.total_box ul li:nth-child(4) p {
  background: #993636;
}

.total_box ul li:nth-child(5) p {
  background: #3636cc;
}

.total_box ul li:nth-child(6) p {
  background: #3636cc;
}

.total_box ul li div {
  display: inline-block;
  height: 100px;
  vertical-align: middle;
}

.total_box ul li div span {
  display: block;
  height: 32px;
  line-height: 32px;
  font-size: 20px;
}

.total_box ul li div span:nth-child(2) {
  font-size: 28px;
  color: #00ffff;
  font-weight: bold;
}

.total_box ul li div span:nth-child(3) {
  color: #eede07;
}

.money {
  font-size: 20px;
  font-style: normal;
  color: #ffffff;
  font-weight: normal;
}
</style>
