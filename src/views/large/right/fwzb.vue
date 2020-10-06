<template>
  <div class="box fwzb">
    <span class="top"></span>
    <span class="left"></span>
    <span class="right"></span>
    <span class="bottom"></span>
    <div class="txt">
      <h2>各类型服务使用占比</h2>
      <div class="pie pie3"
        id="pie4"
        :style="{ height: '260px'}"></div>
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
  props: ['fwtjreserve', 'fwtjldata'],
  mounted() {
    this.draw('pie4', this.fwtjldata, this.fwtjreserve)
  },
  watch: {
    fwtjreserve(val) {
      this.draw('pie4', this.fwtjldata, val)
    }
  },
  methods: {
    draw(id, legenddata, data) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        backgroundColor: 'transparent',
        color: ['#974DFF', '#4DFFD7', '#FFDB5C', '#FF4D93'],
        legend: {
          orient: 'vartical',
          x: 'left',
          top: 'center',
          left: '65%',
          bottom: '0%',
          data: legenddata,
          itemWidth: 35,
          itemHeight: 15,
          itemGap: 24,
          formatter: function(name) {
            for (var i = 0; i < data.length; i++) {
              if (name === data[i].name) {
                return ' ' + name + '：' + data[i].value + '元'
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

.fwzb {
  height: 310px;
}
</style>
