<template>
  <div class="box lrxx">
    <span class="top"></span>
    <span class="left"></span>
    <span class="right"></span>
    <span class="bottom"></span>
    <div class="txt">
      <h2>老人信息</h2>
      <div class="six">
        <p>
          <span>男性</span>
          <span>{{maleCount?maleCount:'null'}}</span>
        </p>
        <p>
          <span>女性</span>
          <span>{{femaleCount?femaleCount:'null'}}</span>
        </p>
      </div>
      <div class="pie"
        id="pie1"
        :style="{ height: '320px'}"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'HelloWorld',
  data() {
    return {}
  },
  props: ['legenddata', 'reserve', 'maleCount', 'femaleCount'],
  mounted() {
    this.draw('pie1', this.legenddata, this.reserve)
  },
  watch: {
    reserve(val) {
      this.draw('pie1', this.legenddata, val)
    }
  },
  methods: {
    draw(id, legenddata, data) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        backgroundColor: 'transparent',
        color: ['#3FB2EF', '#67E0E3', '#FFDB5C', '#FF9F7F'],
        legend: {
          orient: 'vartical',
          x: 'left',
          top: 'center',
          left: '60%',
          bottom: '0%',
          data: legenddata,
          itemWidth: 35,
          itemHeight: 15,
          itemGap: 24,
          formatter: function(name) {
            for (var i = 0; i < data.length; i++) {
              if (name === data[i].name) {
                return ' ' + name + '：' + data[i].value + '人'
              }
            }
          },
          textStyle: {
            color: '#fff',
            fontSize: 16
          }
        },
        series: [
          {
            type: 'pie',
            clockwise: false,
            minAngle: 2,
            radius: ['40%', '70%'],
            center: ['30%', '50%'],
            avoidLabelOverlap: false,
            label: {
              normal: {
                show: false,
                position: 'center',
                formatter: '{b}\n\n {d}%'
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: 18
                }
              }
            },
            data: data
          }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
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

.lrxx {
  height: 500px;
  margin: 0 20px 20px 0;
}

.lrxx .six p {
  width: 240px;
  height: 100px;
  display: inline-block;
  margin-top: 20px;
  border-radius: 3px;
  line-height: 100px;
}

.lrxx .six p:first-child {
  background: #3cb2ef;
  margin: 0 15px 0 20px;
}

.lrxx .six p:last-child {
  background: #ff4b93;
}

.lrxx .six p span:first-child {
  font-size: 20px;
  margin-left: 30px;
  letter-spacing: 1px;
  vertical-align: middle;
  font-weight: bold;
}

.lrxx .six p span:last-child {
  font-size: 30px;
  font-weight: bold;
  vertical-align: middle;
  float: right;
  margin-right: 30px;
}
</style>
