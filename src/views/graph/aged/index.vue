<template>
  <div>
    <el-row :gutter="16"
      class="statist">
      <el-col :span="6">
        <div class="box"
          style="display: flex;">
          <div class="hint"
            style="width: 100px;">
            <div v-for="(value, key) in indata[0]"
              :key="key">{{ indata[0][key] }}：
              <p>{{ form[key] }} </p>
            </div>
          </div>
          <div id="echart01"
            class="echart"
            :style="{ height: '180px'}"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box"
          style="display: flex;">
          <div class="hint"
            style="width: 100px;">
            <div>享受补贴：
              <p>{{ form.atcount }} </p>
            </div>
          </div>
          <div id="echart04"
            class="echart"
            :style="{ height: '180px'}"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box"
          style="display: flex;">
          <div class="hint"
            style="width: 100px;">
            <div>老人数量：
              <p>{{ form.oldcount }} </p>
            </div>
          </div>
          <div id="echartlr"
            class="echart"
            :style="{ height: '180px'}"></div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box"
          style="display: flex;">
          <div class="hint"
            style="width: 60px;">
            <div v-for="(value, key) in indata[2]"
              :key="key">{{ indata[2][key] }}：
              <p>{{ form[key] }} </p>
            </div>
          </div>
          <div id="echart03"
            class="echart"
            :style="{ height: '180px'}"></div>
        </div>
      </el-col>
    </el-row>
    <div class="dept-container">
      <div style="padding-right: 15px;">
        <div style="width: 500px;">
          <div style="padding-left: 15px;">
            <h3>户口类型</h3>
          </div>
          <div id="echart02"
            :style="{ height: '200px'}"></div>
          <div style="padding-left: 15px;">
            <h3>居住情况</h3>
          </div>
          <div id="echart05"
            :style="{ height: '200px'}"></div>
        </div>
      </div>
      <div class="dept-wrapper">
        <div class="census-box">
          <gould-map :data="lnglats"
            :click-modal="false"></gould-map>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import gouldMap from '@/components/GouldMap/map'
import { getRecordList } from '@/api/page'
import { allApi } from '@/api/config'
import { mapGetters } from 'vuex'

const indata = [
  {
    oldcount: '老人数量',
    atcount: '享受补贴'
  },
  {
    bbb: '城市老人',
    ddd: '农村老人'
  },
  {
    maleCount: '男性',
    femaleCount: '女性'
  },
  {
    reserve1: '与配偶居住',
    reserve2: '与子女居住',
    reserve3: '与父母居住',
    reserve4: '独居',
    reserve5: '其他'
  },
  {
    sixtyTosixtyfive: '60-64岁',
    sixtysixToseventy: '65-69岁',
    seventyToeighty: '70-79岁',
    moreThaneighty: '80岁以上'
  },
  {
    sixtyTosixtyfive2: '60-64岁',
    sixtysixToseventy2: '65-69岁',
    seventyToeighty2: '70-79岁',
    moreThaneighty2: '80岁以上'
  }
]

export default {
  name: 'totalReview',
  components: {
    gouldMap
  },
  data() {
    return {
      btnPowers: null,
      listQuery: {
        orgName: '',
        buidName: '',
        bumkStatus: '',
        olderName: ''
      },
      lnglats: [],
      deptList: [],
      timeQuerys: null,
      dates: ['60—64', '65—69', '70—79', '80及以上'],
      colorL: ['#ff9900', '#ff3300', '#0099cc', '#0066ff'],
      indata,
      allResponse: [],
      form: {
        bbb: 362,
        ddd: 162,
        oldcount: 69,
        atcount: 242,
        femaleCount: 282,
        maleCount: 66,
        reserve1: '',
        reserve2: '',
        reserve3: '',
        reserve4: '',
        reserve5: '',
        // oldlist: null,
        // nlzblist: null,
        sixtyTosixtyfive: '',
        sixtysixToseventy: '',
        seventyToeighty: '',
        moreThaneighty: '',
        sixtyTosixtyfive2: '',
        sixtysixToseventy2: '',
        seventyToeighty2: '',
        moreThaneighty2: ''
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList

    getRecordList(allApi.addresstable.getList, {}).then(response => {
      this.deptList = response.data.dataList
    })

    getRecordList(allApi.large.getBigScreenData, {}).then(response => {
      this.allResponse = response.data
      for (var k of response.data.organizationList) {
        if (k.reserve1 === 'oldcount') {
          this.form.oldcount = k.id
        }
        if (k.reserve1 === 'atcount') {
          this.form.atcount = k.id
        }
      }

      for (const key in this.form) {
        if (this.allResponse.customerList[0][key]) {
          this.form[key] = parseInt(this.allResponse.customerList[0][key])
        }

        if (this.allResponse[key]) {
          this.form[key] = parseInt(this.allResponse[key])
        }
      }

      // this.form.oldlist = [
      //   response.data.areasubsidytarget.reserve1,
      //   response.data.areasubsidytarget.reserve2,
      //   response.data.areasubsidytarget.reserve3,
      //   response.data.areasubsidytarget.reserve4
      // ]

      // this.form.nlzblist = [
      //   parseInt(response.data.cusAgegroupList[0].sixtyTosixtyfive) +
      //     parseInt(response.data.cusAgegroupList[1].sixtyTosixtyfive),
      //   parseInt(response.data.cusAgegroupList[0].sixtysixToseventy) +
      //     parseInt(response.data.cusAgegroupList[1].sixtysixToseventy),
      //   parseInt(response.data.cusAgegroupList[0].seventyToeighty) +
      //     parseInt(response.data.cusAgegroupList[1].seventyToeighty),
      //   parseInt(response.data.cusAgegroupList[0].moreThaneighty) +
      //     parseInt(response.data.cusAgegroupList[1].moreThaneighty)
      // ]

      for (var y of response.data.areasubsidytargetList) {
        if (y.state === 0) {
          this.form.sixtyTosixtyfive2 = y.reserve1
          this.form.sixtysixToseventy2 = y.reserve2
          this.form.seventyToeighty2 = y.reserve3
          this.form.moreThaneighty2 = y.reserve4
        }
      }

      this.form.sixtyTosixtyfive =
        parseInt(response.data.cusAgegroupList[0].sixtyTosixtyfive) +
        parseInt(response.data.cusAgegroupList[1].sixtyTosixtyfive)
      this.form.sixtysixToseventy =
        parseInt(response.data.cusAgegroupList[0].sixtysixToseventy) +
        parseInt(response.data.cusAgegroupList[1].sixtysixToseventy)
      this.form.seventyToeighty =
        parseInt(response.data.cusAgegroupList[0].seventyToeighty) +
        parseInt(response.data.cusAgegroupList[1].seventyToeighty)
      this.form.moreThaneighty =
        parseInt(response.data.cusAgegroupList[0].moreThaneighty) +
        parseInt(response.data.cusAgegroupList[1].moreThaneighty)

      const ageList = this.allResponse.cusAgegroupList.reduce((res, item) => {
        let obj = {}
        obj.title = '城市老人'
        obj.ranges = [
          parseInt(item.sixtyTosixtyfive),
          parseInt(item.sixtysixToseventy),
          parseInt(item.seventyToeighty),
          parseInt(item.moreThaneighty)
        ]
        if (item.liveType === '0') {
          obj.title = '农村老人'
          this.form.ddd =
            obj.ranges[0] + obj.ranges[1] + obj.ranges[2] + obj.ranges[3]
        } else {
          this.form.bbb =
            obj.ranges[0] + obj.ranges[1] + obj.ranges[2] + obj.ranges[3]
        }
        return res.concat(obj)
      }, [])

      this.drawpies('echart01', this.indata[0], this.form, this.colorL)
      this.drawtwoline('echart02', this.dates, ageList)
      this.drawpies('echart03', this.indata[2], this.form, this.colorL)
      this.drawRpies('echart05', this.indata[3], this.form)

      // this.drawTwobars('echart04', this.dates)
      this.drawbt('echart04', this.indata[5], this.form)

      this.drawlr('echartlr', this.indata[4], this.form)

      console.log('allResponse aged', this.allResponse)
      console.log('form', this.form)
    })

    getRecordList(allApi.organization.getList, {
      page: 1,
      pageSize: 20,
      id: this.sysUser.institutionsId
    }).then(response => {
      this.lnglats = response.data.dataList
    })
  },
  methods: {
    handleQuery() {
      console.log(this.listQuery)
    },
    drawlr(id, names, datas) {
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
        color: ['#ff9900', '#cccc33', '#ff3300', '#00ccff'],
        grid: {
          left: '0%',
          right: '0%',
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
            orient: 'vertical',
            data: mtype,
            left: '45%',
            top: 'center',
            formatter: function(name) {
              for (var i = 0; i < mData.length; i++) {
                if (name === mData[i].name) {
                  return name + '：' + mData[i].value
                }
              }
            }
          }
        ],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['30%', '50%'],
            center: ['20%', '50%'],
            data: mData,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: 'center',
                  formatter: '{c}'
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                label: {
                  show: true,
                  fontSize: 16
                }
              }
            }
          }
        ]
      })
    },
    drawbt(id, names, datas) {
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
        color: ['#ff9900', '#cccc33', '#ff3300', '#00ccff'],
        grid: {
          left: '0%',
          right: '0%',
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
            orient: 'vertical',
            data: mtype,
            left: '45%',
            top: 'center',
            formatter: function(name) {
              for (var i = 0; i < mData.length; i++) {
                if (name === mData[i].name) {
                  return name + '：' + mData[i].value
                }
              }
            }
          }
        ],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['30%', '50%'],
            center: ['20%', '50%'],
            data: mData,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: 'center',
                  formatter: '{c}'
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                label: {
                  show: true,
                  fontSize: 16
                }
              }
            }
          }
        ]
      })
    },
    // drawTwobars(id, mtype) {
    //   var myChart = echarts.init(document.getElementById(id))
    //   myChart.setOption({
    //     tooltip: {
    //       trigger: 'axis',
    //       axisPointer: {
    //         type: 'shadow'
    //       }
    //     },
    //     legend: {
    //       data: ['老人数量', '享受补贴'],
    //       textStyle: {
    //         fontSize: 16
    //       }
    //     },
    //     grid: {
    //       left: '3%',
    //       right: '4%',
    //       bottom: '6%',
    //       containLabel: true
    //     },
    //     xAxis: {
    //       type: 'category',
    //       data: mtype,
    //       splitLine: {
    //         show: false
    //       }
    //     },
    //     yAxis: {
    //       type: 'value', // inverse: true
    //       splitLine: {
    //         show: false
    //       }
    //     },
    //     series: [
    //       {
    //         name: '老人数量',
    //         data: this.form.nlzblist,
    //         type: 'bar',
    //         barWidth: '30',
    //         itemStyle: {
    //           normal: {
    //             color: '#999'
    //           }
    //         },
    //         label: {
    //           normal: {
    //             show: true,
    //             position: 'top'
    //           }
    //         }
    //       },
    //       {
    //         name: '享受补贴',
    //         data: this.form.oldlist,
    //         type: 'bar',
    //         barGap: '-100%',
    //         barWidth: '30',
    //         itemStyle: {
    //           normal: {
    //             color: '#ff3300'
    //           }
    //         },
    //         label: {
    //           normal: {
    //             show: true,
    //             position: 'inside'
    //           }
    //         }
    //       }
    //     ]
    //   })
    // },
    drawtwoline(id, mtype, lists) {
      console.log(lists)
      var myChart = echarts.init(document.getElementById(id))
      var seriesList = []
      const colorline = ['#00ccff', '#ff6600']
      for (let [i, item] of lists.entries()) {
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
          top: 20,
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
          top: 70,
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
          axisLine: {
            lineStyle: {
              color: '#333'
            }
          },
          splitLine: {
            show: false
          }
        },
        series: seriesList
      })
    },
    drawpies(id, names, datas, colorL, orient) {
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
            minAngle: 2,
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
                  show: false,
                  position: 'center',
                  formatter: '{c}'
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                label: {
                  show: true,
                  fontSize: 16
                }
              }
            }
          }
        ]
      })
    },
    drawRpies(id, names, datas) {
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
        color: ['#ff9900', '#cccc33', '#ff3300', '#00ccff', '#0099ff'],
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
            orient: 'vertical',
            data: mtype,
            left: '60%',
            top: 'center',
            formatter: function(name) {
              for (var i = 0; i < mData.length; i++) {
                if (name === mData[i].name) {
                  return name + '：' + mData[i].value
                }
              }
            }
          }
        ],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['50%', '85%'],
            center: ['32%', '50%'],
            data: mData,
            itemStyle: {
              normal: {
                label: {
                  show: false,
                  position: 'center',
                  formatter: '{c}'
                }
              },
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                label: {
                  show: true,
                  fontSize: 16
                }
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
.statist {
  margin-bottom: 20px;
  .box {
    border: 1px solid #c9c9c9;
    .hint {
      margin-top: 10px;
      margin-left: 20px;
      line-height: 32px;
      font-weight: bold;
    }

    .echart {
      flex: 1;
    }
  }
}

.census-box {
  border: 1px solid #c9c9c9;
}
</style>
