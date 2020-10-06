<template>
  <div class="box fwtj">
    <span class="top"></span>
    <span class="left"></span>
    <span class="right"></span>
    <span class="bottom"></span>
    <div class="txt">
      <h2>服务统计</h2>
      <div class="pie"
        id="pie2"
        :style="{ height: '320px'}"></div>
      <div class="total">
        <h3>服务状态</h3>
        <ul>
          <li>
            <span>{{count1}}</span>
            <span>已完成</span>
          </li>
          <li>
            <span>{{count2}}</span>
            <span>待服务</span>
          </li>
          <li>
            <span>{{count3}}</span>
            <span>进行中</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'HelloWorld',
  data() {
    return {
      count1: 0,
      count2: 0,
      count3: 0
    }
  },
  props: ['fwtjreserve', 'fwtjldata', 'fwstate'],
  mounted() {
    this.draw('pie2', this.fwtjldata, this.fwtjreserve)
    this.state(this.fwstate)
  },
  watch: {
    fwtjreserve(val) {
      this.draw('pie2', this.fwtjldata, val)
    },
    fwstate(val) {
      this.state(val)
    }
  },
  methods: {
    state(fw) {
      for (const f of fw) {
        // Wdstate：工单状态
        // 2，待服务   3，进行中   4,已完成
        // Count：数量
        if (f.wdState === 4) {
          this.count1 = f.count
        } else if (f.wdState === 2) {
          this.count2 = f.count
        } else if (f.wdState === 3) {
          this.count3 = f.count
        }
      }
    },
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
                return ' ' + name + '：' + data[i].value + '次'
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

.fwtj {
  height: 560px;
}

.fwtj .txt .total h3 {
  font-size: 20px;
  margin: 10px 0 20px 15px;
}

.fwtj .txt .total ul li {
  float: left;
  width: 160px;
  height: 100px;
  text-align: center;
  border-radius: 3px;
  margin-right: 10px;
}

.fwtj .txt .total ul li:nth-child(1) {
  background: #2a2aea;
  margin-left: -20px;
}

.fwtj .txt .total ul li:nth-child(2) {
  background: #ff4b93;
}

.fwtj .txt .total ul li:nth-child(3) {
  background: #4b99ff;
}

.fwtj .txt .total ul li span {
  display: block;
}

.fwtj .txt .total ul li span:first-child {
  font-size: 30px;
  font-weight: bold;
  margin: 10px 0;
}

.fwtj .txt .total ul li span:last-child {
  font-size: 20px;
  font-weight: bold;
}
</style>
