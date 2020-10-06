<template>
  <div class="box jzqk">
    <span class="top"></span>
    <span class="left"></span>
    <span class="right"></span>
    <span class="bottom"></span>
    <div class="txt">
      <h2>居住情况分布</h2>
      <div class="bar"
        id="bar1"
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
  props: ['jzqkreserve', 'jzqkldata'],
  mounted() {
    this.draw('bar1', this.jzqkldata, this.jzqkreserve)
  },
  watch: {
    jzqkreserve(val) {
      this.draw('bar1', this.jzqkldata, val)
    }
  },
  methods: {
    draw(id, legenddata, data) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        backgroundColor: 'transparent',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'value',
            splitLine: {
              show: false
            },
            nameTextStyle: {
              fontSize: 16,
              color: '#ffffff'
            },
            axisLabel: {
              textStyle: {
                fontSize: 16,
                color: '#ffffff'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#ffffff'
              }
            }
          }
        ],
        yAxis: {
          type: 'category',
          axisTick: {
            show: false,
            color: '#ffffff'
          },
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: 16,
              color: '#ffffff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#ffffff'
            }
          },
          data: legenddata
        },
        series: [
          {
            type: 'bar',
            barWidth: 30,
            barGap: '-50%',
            data: data,
            itemStyle: {
              normal: {
                color: '#00A8EE'
              }
            }
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

.jzqk {
  height: 400px;
}
</style>
