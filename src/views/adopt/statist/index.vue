<template>
  <div class="main-container">
    <el-row :gutter="10">
      <el-col :span="8">
        <el-card>
          <div slot="header">
            <span>机构分类统计</span>
          </div>
          <el-table border
            :data="list"
            style="width: 100%;">
            <el-table-column width="60"
              header-align="center"
              align="center">
              <template slot-scope="scope">
                <span>{{ scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column label="行政区划"
              prop="realName"
              align="center">
            </el-table-column>
            <el-table-column label="养老机构总数"
              prop="olderName"
              align="center">
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <div slot="header">
            <span>分类统计图</span>
          </div>
          <div class="census-wrapper clearfix">
            <div class="census">
              <div class="box">
                <div id="echart01"
                  :style="{ height: '320px'}"></div>
              </div>
            </div>
            <div class="census">
              <div class="box">
                <div id="echart02"
                  :style="{ height: '320px'}"></div>
              </div>
            </div>
            <div class="census">
              <div class="box">
                <div id="echart03"
                  :style="{ height: '320px'}"></div>
              </div>
            </div>
            <div class="census">
              <div class="box">
                <div id="echart04"
                  :style="{ height: '320px'}"></div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'

const list = [
  {
    realName: 'uyuy'
  },
  {
    realName: 'asd'
  },
  {
    realName: 'ascvb'
  },
  {
    realName: 'wdfgh'
  },
  {
    realName: 'tghj'
  }
]

export default {
  name: 'HelloWorld',
  data() {
    return {
      list,
      btnPowers: null
    }
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    const obj = {
      typeList: ['一', '二', '三', '四', '五', '六'],
      barList: [160, 156, 86, 230, 120, 210],
      lineList: [5, 10, 6, 8, 9, 7]
    }

    this.drawbarline('echart01', obj, '#5c89ff', '#d77e00')
    this.drawbarline('echart02', obj, '#685ad1', '#d77e00')
    this.drawbarline('echart03', obj, '#b3df2e', '#d77e00')
    this.drawbarline('echart04', obj, '#f1bd26', '#d77e00')
  },
  methods: {
    drawbarline(id, data, colorbar, colorline) {
      const myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        legend: {
          top: 10,
          right: 50,
          itemWidth: 12,
          itemHeight: 10,
          textStyle: {
            color: '#2095ed',
            fontSize: 14
          }
        },
        grid: {
          left: 30,
          right: 27,
          top: 60,
          bottom: 20,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: data.typeList,
            axisLine: {
              lineStyle: {
                color: '#707179'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: '( 亿元 )',
            min: 0,
            max: 240,
            interval: 40,
            axisLine: {
              lineStyle: {
                color: '#707179'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#ddd'],
                width: 1,
                type: 'solid'
              }
            }
          },
          {
            type: 'value',
            min: 0,
            max: 12,
            interval: 2,
            axisLine: {
              lineStyle: {
                color: '#707179'
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#ddd'],
                width: 1,
                type: 'solid'
              }
            }
          }
        ],
        series: [
          {
            name: '本年数',
            type: 'bar',
            data: data.barList,
            barWidth: 20,
            yAxisIndex: 0,
            animationDuration: 3000,
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: '#2095ed',
                  fontSize: 14
                }
              }
            },
            itemStyle: {
              normal: {
                color: colorbar
              }
            }
          },
          {
            name: '同比增幅',
            type: 'line',
            data: data.lineList,
            symbol: 'circle',
            symbolSize: 6,
            yAxisIndex: 1,
            animationDuration: 2000,
            label: {
              normal: {
                show: true,
                position: 'top',
                textStyle: {
                  color: colorline,
                  fontSize: 14
                }
              }
            },
            itemStyle: {
              normal: {
                color: colorline
              }
            }
          }
        ]
      })
    },
    drawsolidpies(id) {
      const myChart = echarts.init(document.getElementById(id))
      myChart.setOption({})
    }
  }
}
</script>

<style lang="scss" scoped>
.el-radio-group {
  .group-one {
    display: inline-block;
    margin-right: 15px;
  }
}

.census-wrapper {
  .census {
    width: 50%;
    float: left;
    .box {
      margin: 8px;
      background: #f2f2f2;
      border-radius: 8px;
    }
  }
}
</style>
