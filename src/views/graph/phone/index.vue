<template>
  <div class="main-container">
    <div class="call-top">
      <div class="total-td">
        <el-row>
          <el-col :span="6">待回访工单
            <span>{{ form.reserve1 }}</span>
          </el-col>
          <el-col :span="6">待处理任务
            <span>{{ form.reserve2 }}</span>
          </el-col>
          <el-col :span="6">待处理投诉
            <span>{{ form.reserve3 }}</span>
          </el-col>
          <el-col :span="6">待处理预警
            <span>{{ form.reserve4 }}</span>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="filter-container">
      <div class="time-editor">
        <div class="type">
          呼叫时间
        </div>
        <el-date-picker v-model="timeQuerys"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </div>
      <el-button type="primary"
        icon="el-icon-search"
        @click="handleQuery">查询</el-button>
    </div>
    <el-row class="census"
      :gutter="15">
      <el-col :span="8">
        <div class="box"
          style="display: flex;">
          <div style="padding-left: 15px;">
            <h3>呼叫统计</h3>
            <div class="hint"
              style="width: 150px;">
              <p>呼叫总量：
                <span>{{ form.total }}</span>
              </p>
              <p v-for="(value, key) in indata[0]"
                :key="key">{{ indata[0][key] }}：
                <span>{{ form[key] }}</span>
              </p>
            </div>
          </div>
          <div id="echart01"
            class="echart"
            :style="{ height: '320px'}"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="box"
          style="display: flex;">
          <div style="padding-left: 15px;">
            <h3>时长统计</h3>
            <div class="hint"
              style="width: 150px;">
              <p>总时长：
                <span>{{ form.callSumTime }}</span>
              </p>
              <p v-for="(value, key) in indata[1]"
                :key="key">{{ indata[1][key] }}：
                <span>{{ form[key] }} </span>
              </p>
            </div>
          </div>
          <div id="echart02"
            class="echart"
            :style="{ height: '320px'}"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="box"
          style="display: flex;">
          <div style="padding-left: 15px;">
            <h3>呼入统计</h3>
            <div class="hint"
              style="width: 150px;">
              <p>呼入数量：
                <span>{{ form.hrsl }}</span>
              </p>
              <p v-for="(value, key) in indata[2]"
                :key="key">{{ indata[2][key] }}：
                <span>{{ form[key] }} </span>
              </p>
            </div>
          </div>
          <div id="echart03"
            class="echart"
            :style="{ height: '320px'}"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="box">
          <div style="padding-left: 15px;">
            <h3>呼出统计</h3>
          </div>
          <div id="echart04"
            :style="{ height: '270px'}"></div>
        </div>
      </el-col>
      <el-col :span="16">
        <div class="box">
          <div style="padding-left: 15px;">
            <h3>满意度</h3>
          </div>
          <div id="echart05"
            :style="{ height: '270px'}"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import { mapGetters } from 'vuex'
import { getRecordList, findHujiaoHomepage } from '@/api/page'
import { allApi } from '@/api/call'

const indata = [
  {
    bbb: '呼入接通',
    ccc: '呼入未接通',
    ddd: '呼出接通',
    fff: '呼出未接通'
  },
  {
    callTime: '呼入',
    calloutTime: '呼出'
  },
  {
    zx: '咨询',
    ts: '投诉',
    xd: '下单'
  },
  {
    a: '直接拨打',
    b: '工单回访',
    c: '任务计划',
    d: '处理投诉',
    e: '处理预警'
  }
]

export default {
  name: 'HelloWorld',
  data() {
    return {
      indata,
      btnPowers: null,
      timeQuerys: null,
      dates: ['10-01', '10-02', '10-03', '10-04', '10-05', '10-06'],
      degrees: [
        {
          title: '不满意',
          ranges: [20, 10, 15, 10, 30, 50]
        },
        {
          title: '满意',
          ranges: [50, 30, 55, 70, 20, 30]
        },
        {
          title: '非常满意',
          ranges: [30, 60, 30, 20, 50, 20]
        }
      ],
      colorL: ['#00cc66', '#009933', '#0099cc', '#0066ff'],
      colorH: ['#ffcc00', '#ff3300', '#cccc33'],
      form: {
        total: 0,
        bbb: 0,
        ccc: 0,
        ddd: 0,
        fff: 0,
        callSumTime: 0,
        hrsl: 0,
        zx: 0,
        xd: 0,
        ts: 0,
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        e: 0
      }
    }
  },
  computed: {
    ...mapGetters(['voip'])
  },
  mounted() {
    getRecordList(allApi.allRecord, {}).then(response => {
      console.log(111, response)
      if (response.data) {
        this.form.reserve1 = response.data.reserve1
        this.form.reserve2 = response.data.reserve2
        this.form.reserve3 = response.data.reserve3
        this.form.reserve4 = response.data.reserve4

        console.log(this.form)
      }
    })

    this.getData({})

    this.drawtwoline('echart05', this.dates, this.degrees)
  },
  methods: {
    handleQuery() {
      if (this.timeQuerys) {
        this.getData({
          beginTime: this.timeQuerys[0],
          endTime: this.timeQuerys[1]
        })
      }
    },
    getData(params) {
      findHujiaoHomepage(allApi.callcenter, params).then(res => {
        this.form.total = res.data.hujiaoSummary.callSumCount
        this.form.bbb = res.data.hujiaoSummary.callConnect
        this.form.ccc = res.data.hujiaoSummary.callnotConnect
        this.form.ddd = res.data.hujiaoSummary.calloutConnect
        this.form.fff = res.data.hujiaoSummary.calloutnotConnect

        this.form.callSumTime = res.data.hujiaoSummary.callSumTime
        this.form.callTime = res.data.hujiaoSummary.callTime
        this.form.calloutTime = res.data.hujiaoSummary.calloutTime

        // 呼入统计
        this.form.zx = 0
        this.form.xd = 0
        this.form.ts = 0
        if (res.data.callmanageList.length !== 0) {
          for (var k of res.data.callmanageList) {
            if (k.callType === 1) {
              this.form.zx = k.id
            } else if (k.callType === 3) {
              this.form.xd = k.id
            } else if (k.callType === 2) {
              this.form.ts = k.id
            }
          }
        }
        this.form.hrsl =
          parseInt(this.form.zx) +
          parseInt(this.form.xd) +
          parseInt(this.form.ts)

        this.form.a = 0
        this.form.b = 0
        this.form.c = 0
        this.form.d = 0
        this.form.e = 0
        if (res.data.calloutmanageList.length !== 0) {
          for (var j of res.data.calloutmanageList) {
            if (j.calloutType === 1) {
              this.form.a = j.id
            } else if (j.calloutType === 2) {
              this.form.b = j.id
            } else if (j.calloutType === 3) {
              this.form.c = j.id
            } else if (j.calloutType === 4) {
              this.form.d = j.id
            } else if (j.calloutType === 5) {
              this.form.e = j.id
            }
          }
        }

        this.drawpies('echart01', this.indata[0], this.form, this.colorL)
        this.drawpies('echart02', this.indata[1], this.form, this.colorL)
        this.drawpies('echart03', this.indata[2], this.form, this.colorH)
        this.drawAlarm('echart04', this.indata[3], this.form)
      })
    },
    drawpies(id, names, datas, colorL) {
      var myChart = echarts.init(document.getElementById(id))
      var mtype = []
      var mData = []
      for (var key in names) {
        mtype.push(names[key])
        mData.push({
          value: datas[key],
          name: names[key]
        })
      }

      myChart.setOption({
        grid: {
          left: '5%',
          right: '7%',
          top: '3%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: [
          {
            data: mtype,
            width: 256,
            left: 'center',
            top: '71%'
          }
        ],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['30%', '50%'],
            center: ['50%', '40%'],
            data: mData,
            itemStyle: {
              normal: {
                color: function(params) {
                  var colorList = colorL
                  return colorList[params.dataIndex]
                },
                label: {
                  show: false
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    },
    drawAlarm(id, names, datas) {
      const myChart = echarts.init(document.getElementById(id))
      var mtype = []
      var mData = []
      for (var key in names) {
        mtype.push(names[key])
        mData.push(datas[key])
      }

      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '8%',
          right: '8%',
          top: '8%',
          bottom: '8%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'category',
          data: mtype,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          }
        },
        series: [
          {
            name: '数值',
            data: mData,
            type: 'bar',
            barWidth: 20,
            label: {
              normal: {
                show: true,
                position: 'right',
                textStyle: {
                  color: '#333'
                }
              }
            },
            itemStyle: {
              normal: {
                color: '#0066ff'
              }
            }
          }
        ]
      })
    },
    drawtwoline(id, mtype, lists) {
      var myChart = echarts.init(document.getElementById(id))
      var seriesList = []
      const colorline = ['#ff0000', '#339900', '#0066ff']
      for (let [i, item] of lists.entries()) {
        console.log(i)
        seriesList.push({
          name: item.title,
          type: 'line',
          data: item.ranges,
          symbol: 'circle',
          symbolSize: 8,
          label: {
            normal: {
              show: true,
              position: 'top',
              textStyle: {
                color: colorline[i],
                fontSize: 14
              }
            }
          },
          itemStyle: {
            normal: {
              color: colorline[i]
            }
          }
        })
      }

      myChart.setOption({
        legend: {
          top: 0,
          right: 50,
          itemWidth: 12,
          itemHeight: 10,
          textStyle: {
            color: '#333',
            fontSize: 14
          }
        },
        grid: {
          left: 50,
          right: 50,
          top: 50,
          bottom: 40,
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
        xAxis: {
          type: 'category',
          data: mtype,
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          name: '( % )',
          max: 100,
          axisLine: {
            lineStyle: {
              color: '#333'
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
        series: seriesList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.call-top {
  display: flex;
  border: 1px solid #c9c9c9;
  border-radius: 5px;
  margin-bottom: 20px;
  .call {
    width: 560px;
    padding-top: 10px;
    text-align: center;
  }

  .total-td {
    flex: 1;
    .el-col {
      height: 60px;
      line-height: 60px;
      text-align: center;
      border-left: 1px solid #c9c9c9;
      &:first-child {
        border-left: none;
      }

      span {
        color: red;
        font-size: 24px;
        text-decoration: underline;
        margin-left: 8px;
      }
    }
  }
}

.census {
  .el-col {
    padding-bottom: 15px;
    .box {
      border: 1px solid #c9c9c9;
      .hint {
        margin-top: 10px;
        margin-left: 20px;
        line-height: 36px;
      }

      .echart {
        flex: 1;
      }
    }
  }
}
</style>
