<template>
  <div class="box bzze">
    <span class="top"></span>
    <span class="left"></span>
    <span class="right"></span>
    <span class="bottom"></span>
    <div class="txt">
      <div class="money1">
        <p>
          <span class="num">{{SubsidyCount}}</span>
          <span>元</span>
        </p>
        <div>2019年补助发放总额</div>
      </div>
      <div class="money2">
        <p>
          <span class="num">{{citySubsidy}}</span>
          <span>元</span>
        </p>
        <div>2019年补助使用总额</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      count: 0
    }
  },
  props: ['citySubsidy', 'SubsidyCount'],
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

.bzze {
  height: 240px;
  margin: 0 20px 20px 0;
}

.bzze .txt {
  margin-top: 10px;
}

.bzze .txt > div {
  width: 500px;
  height: 90px;
  border-radius: 3px;
  margin: 20px auto;
  text-align: center;
}

.bzze .txt > div p {
  padding: 15px 0 10px 0;
}

.bzze .txt > div {
  font-size: 20px;
}

.bzze .txt > div span.num {
  color: #5dcfff;
  font-size: 28px;
  font-weight: bold;
}

.bzze .txt .money1 {
  background: #0039c9;
}

.bzze .txt .money2 {
  background: #421ccf;
}
</style>
