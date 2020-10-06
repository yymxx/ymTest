<template>
  <div>
    <el-row :gutter="16"
      class="statist">
      <el-col :span="10">
        <div class="box clearfix">
          <div class="msg">
            <h3>{{ form.communityCount }}</h3>
            <p>社区</p>
          </div>
          <div class="msg">
            <h3>{{ form.org12count }}</h3>
            <p>养老机构</p>
          </div>
          <div class="msg">
            <h3>{{ form.oldcount }}</h3>
            <p>老人数量</p>
          </div>
          <div class="msg">
            <h3>{{ form.atcount }}</h3>
            <p>补贴对象</p>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="box clearfix">
          <div class="msg"
            style="width: 33%;">
            <h3>{{ form.org34count }}</h3>
            <p>服务中心</p>
          </div>
          <div class="msg"
            style="width: 33%;">
            <h3>{{ form.stcount }}</h3>
            <p>服务站</p>
          </div>
          <div class="msg"
            style="width: 33%;">
            <h3>{{ form.helpercount }}</h3>
            <p>服务人员</p>
          </div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="box clearfix">
          <div class="msg"
            style="width: 50%;">
            <h3>{{ form.wotoal }}</h3>
            <p>服务数量</p>
          </div>
          <div class="msg"
            style="width: 50%;">
            <h3>{{ form.calltotal }}</h3>
            <p>呼叫数量</p>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="dept-container">
      <div style="padding-right: 15px;">
        <div class="filter-container"
          style="width: 500px;">
          <div class="time-editor">
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
            @click="handleQuery()">查询</el-button>
        </div>
        <div style="padding-left: 15px;">
          <h3>服务项目</h3>
        </div>
        <div id="echart01"
          :style="{ height: '200px'}"></div>
        <div style="padding-left: 15px;">
          <h3>服务状态</h3>
        </div>
        <div id="echart02"
          :style="{ height: '200px'}"></div>
      </div>
      <div class="dept-wrapper">
        <div class="census-box">
          <gould-map height="580px"
            :data="lnglats"
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
    ddd: '老人数量',
    fff: '享受补贴数量'
  },
  {
    bbb: '预约中',
    ccc: '进行中',
    ddd: '已完成'
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
      deptList: [],
      lnglats: [],
      indata,
      dates: ['助餐', '助洁', '助医', '照护', '其他'],
      mData: [0, 0, 0, 0, 0],
      colorL: ['#ff9900', '#cccc33', '#ff3300'],
      timeQuerys: null,
      allResponse: [],
      form: {
        bbb: 0,
        ccc: 0,
        ddd: 0,
        fff: 0,
        oldcount: 0,
        atcount: 0,
        helpercount: 0,
        stcount: 0,
        org12count: 0,
        org34count: 0,
        wotoal: 0,
        calltotal: 0,
        communityCount: 0
      }
    }
  },
  computed: {
    ...mapGetters(['sysUser'])
  },
  mounted() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)

    getRecordList(allApi.addresstable.getList, {}).then(response => {
      console.log(222, response)
      this.deptList = response.data.dataList
    })

    getRecordList(allApi.organization.getList, {
      page: 1,
      pageSize: 20,
      id: this.sysUser.institutionsId
    }).then(response => {
      this.lnglats = response.data.dataList
    })

    this.getData({})
  },
  methods: {
    handleQuery() {
      console.log(this.timeQuerys)
      if (this.timeQuerys) {
        this.getData({
          startTime: this.timeQuerys[0],
          stopTime: this.timeQuerys[1]
        })
      }
    },
    getData(params) {
      getRecordList(allApi.large.getBigScreenData, params).then(response => {
        this.allResponse = response.data
        console.log('allResponse', this.allResponse)

        if (response.data.wdstateGroupList.length === 0) {
          this.form.bbb = 0
          this.form.ccc = 0
          this.form.ddd = 0
        } else {
          for (const f of response.data.wdstateGroupList) {
            // Wdstate：工单状态
            // 2，待服务   3，进行中   4,已完成
            // Count：数量
            if (f.wdState === 2) {
              this.form.bbb = f.count
            } else if (f.wdState === 3) {
              this.form.ccc = f.count
            } else if (f.wdState === 4) {
              this.form.ddd = f.count
            }
          }
        }

        for (var k of response.data.organizationList) {
          var callCount, calloutCount
          if (k.reserve1 === 'oldcount') {
            this.form.oldcount = k.id
          } else if (k.reserve1 === 'atcount') {
            this.form.atcount = k.id
          } else if (k.reserve1 === 'helpercount') {
            this.form.helpercount = k.id
          } else if (k.reserve1 === 'stcount') {
            this.form.stcount = k.id
          } else if (k.reserve1 === 'org12count') {
            this.form.org12count = k.id
          } else if (k.reserve1 === 'org34count') {
            this.form.org34count = k.id
          } else if (k.reserve1 === 'wotoal') {
            this.form.wotoal = k.id
          } else if (k.reserve1 === 'callCount') {
            callCount = k.id
          } else if (k.reserve1 === 'calloutCount') {
            calloutCount = k.id
          } else if (k.reserve1 === 'communityCount') {
            this.form.communityCount = k.id
          }
          this.form.calltotal = parseInt(callCount) + parseInt(calloutCount)
        }

        //  1:助餐 2:助洁 3:助医 7:远程照护 4、5、6其他
        if (response.data.wdclassGroupList.length === 0) {
          this.mData = [0, 0, 0, 0, 0]
        } else {
          for (var j of response.data.wdclassGroupList) {
            let [a, b, c] = [0, 0, 0]
            if (j.wdClass === '1') {
              this.mData[0] = j.count
            }
            if (j.wdClass === '2') {
              this.mData[1] = j.count
            }
            if (j.wdClass === '3') {
              this.mData[2] = j.count
            }
            if (j.wdClass === '7') {
              this.mData[3] = j.count
            }
            if (j.wdClass === '4') {
              a = j.count
            }
            if (j.wdClass === '5') {
              b = j.count
            }
            if (j.wdClass === '6') {
              c = j.count
            }
            this.mData[4] = parseInt(a) + parseInt(b) + parseInt(c)
          }
        }

        this.drawbars('echart01', this.dates, this.mData)
        this.drawRpies('echart02', this.indata[1], this.form, this.colorL)
      })
    },
    drawbars(id, mtype, mData) {
      var myChart = echarts.init(document.getElementById(id))
      myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '12%',
          bottom: '6%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: mtype,
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value', // inverse: true
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '',
            data: mData,
            type: 'bar',
            barWidth: '30',
            itemStyle: {
              normal: {
                color: '#0099ff'
              }
            },
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            }
          }
        ]
      })
    },
    drawRpies(id, names, datas, colorL) {
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
    }
  }
}
</script>

<style lang="scss" scoped>
.statist {
  margin-bottom: 20px;
  .box {
    padding: 0 15px 20px;
    border: 1px solid #c9c9c9;
    .msg {
      width: 25%;
      float: left;
      font-size: 14px;
      text-align: center;
      h3 {
        font-size: 32px;
        margin: 20px 0;
      }
    }
  }
}

.census-box {
  border: 1px solid #c9c9c9;
}
</style>
