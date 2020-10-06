<template>
  <div class="large-container">
    <div class="header">
      {{title}}
    </div>
    <div class="container">
      <!-- left -->
      <div class="left_box">
        <left :reserve="reserve"
          :legenddata="legenddata"
          :jzqkreserve="jzqkreserve"
          :jzqkldata="jzqkldata"
          :fwtjreserve="fwtjreserve"
          :fwtjldata="fwtjldata"
          :fwstate="fwstate"
          :jxlist="jxlist"
          :maleCount="maleCount"
          :femaleCount="femaleCount"
          :latelyWorkorderList="latelyWorkorderList"
          :wdclassGroupList="wdclassGroupList"
          :wdstateGroupList="wdstateGroupList"></left>
      </div>
      <!-- center -->
      <div class="center_box">
        <center :oldcount="oldcount"
          :mantotal="mantotal"
          :atcount="atcount"
          :stcount="stcount"
          :fwcount="fwcount"
          :citySubsidy="citySubsidy"
          :SubsidyCount="SubsidyCount"
          :hjtotal="hjtotal"></center>
      </div>
      <!-- right -->
      <div class="right_box">
        <right :fwtjreserveprice="fwtjreserveprice"
          :fwtjldata="fwtjldata"
          :citySubsidy="citySubsidy"
          :SubsidyCount="SubsidyCount"
          :nlbzreserve="nlbzreserve"
          :legenddata="legenddata"
          :hrtjreserve="hrtjreserve"
          :hrtjdata="hrtjdata"
          :hctjreserve="hctjreserve"
          :hctjdata="hctjdata"
          :callgroup="callgroup"></right>
      </div>
    </div>
  </div>
</template>

<script>
import { getBigScreenData } from '@/api/large'
import { allApi } from '@/api/config'
import left from './left'
import center from './center'
import right from './right'
export default {
  name: 'HelloWorld',
  components: {
    left,
    center,
    right
  },
  data() {
    return {
      title: '蔡甸区居家养老大数据平台',
      // left
      reserve: [],
      legenddata: ['60-64岁', '65-69岁', '70-79岁', '80岁以上'],
      jzqkreserve: [],
      jzqkldata: ['其他', '独居', '与父母', '与子女', '与配偶'],
      fwtjreserve: [],
      fwtjldata: ['助餐', '助医', '助洁', '远程照护'],
      fwstate: [],
      jxlist: [],
      maleCount: null,
      femaleCount: null,
      latelyWorkorderList: null,
      wdclassGroupList: null,
      wdstateGroupList: null,
      // center
      oldcount: 0,
      mantotal: 0,
      atcount: 0,
      stcount: 0,
      fwcount: 0,
      // right
      fwtjreserveprice: [],
      citySubsidy: null,
      SubsidyCount: null,
      hjtotal: null,
      nlbzreserve: [],
      hrtjreserve: [],
      hrtjdata: ['下单', '咨询', '投诉'],
      hctjreserve: [],
      hctjdata: ['工单回访', '处理投诉', '处理任务', '处理预警', '直接拨打'],
      callgroup: []
    }
  },
  created() {
    // 新接口
    getBigScreenData(allApi.large.getBigScreenData, {}).then(res => {
      // lrxx
      this.maleCount = res.data.maleCount
      this.femaleCount = res.data.femaleCount
      this.reserve = [
        {
          name: this.legenddata[0],
          value:
            parseInt(res.data.cusAgegroupList[0].sixtyTosixtyfive) +
            parseInt(res.data.cusAgegroupList[1].sixtyTosixtyfive)
        },
        {
          name: this.legenddata[1],
          value:
            parseInt(res.data.cusAgegroupList[0].sixtysixToseventy) +
            parseInt(res.data.cusAgegroupList[1].sixtysixToseventy)
        },
        {
          name: this.legenddata[2],
          value:
            parseInt(res.data.cusAgegroupList[0].seventyToeighty) +
            parseInt(res.data.cusAgegroupList[1].seventyToeighty)
        },
        {
          name: this.legenddata[3],
          value:
            parseInt(res.data.cusAgegroupList[0].moreThaneighty) +
            parseInt(res.data.cusAgegroupList[1].moreThaneighty)
        }
      ]

      // jzqk
      this.jzqkreserve = [
        {
          name: this.jzqkldata[0],
          value: res.data.customerList[0].reserve5
        },
        {
          name: this.jzqkldata[1],
          value: res.data.customerList[0].reserve4
        },
        {
          name: this.jzqkldata[2],
          value: res.data.customerList[0].reserve3
        },
        {
          name: this.jzqkldata[3],
          value: res.data.customerList[0].reserve2
        },
        {
          name: this.jzqkldata[4],
          value: res.data.customerList[0].reserve1
        }
      ]

      // jxfw
      this.jxlist = res.data.latelyWorkorderList

      // fwtj 1:助餐 2:助洁 3:助医 7:远程照护 ['助餐', '助医', '助洁', '远程照护'],
      this.fwtjreserve = [
        {
          name: this.fwtjldata[0],
          value: 0
        },
        {
          name: this.fwtjldata[1],
          value: 0
        },
        {
          name: this.fwtjldata[2],
          value: 0
        },
        {
          name: this.fwtjldata[3],
          value: 0
        }
      ]
      for (var i of res.data.wdclassGroupList) {
        if (i.wdClass === '1') {
          this.fwtjreserve[0].value = i.count
        }
        if (i.wdClass === '3') {
          this.fwtjreserve[1].value = i.count
        }
        if (i.wdClass === '2') {
          this.fwtjreserve[2].value = i.count
        }
        if (i.wdClass === '7') {
          this.fwtjreserve[3].value = i.count
        }
      }

      // fwtj
      this.fwstate = res.data.wdstateGroupList

      // center
      for (var k of res.data.organizationList) {
        if (k.reserve1 === 'oldcount') {
          this.oldcount = k.id
        }
        if (k.reserve1 === 'mantotal') {
          this.mantotal = k.id
        }
        if (k.reserve1 === 'atcount') {
          this.atcount = k.id
        }
        if (k.reserve1 === 'stcount') {
          this.stcount = k.id
        }
      }
      for (var j of res.data.wdclassGroupList) {
        this.fwcount = parseInt(this.fwcount) + parseInt(j.count)
      }

      // right
      for (var h of res.data.organizationList) {
        var hjtotal1, hjtotal2
        if (h.reserve1 === 'citySubsidy') {
          this.citySubsidy = h.id
        }
        if (h.reserve1 === 'SubsidyCount') {
          this.SubsidyCount = h.id
        }
        if (h.reserve1 === 'callCount') {
          hjtotal1 = parseInt(h.id)
        }
        if (h.reserve1 === 'calloutCount') {
          hjtotal2 = parseInt(h.id)
        }
        this.hjtotal = parseInt(hjtotal1) + parseInt(hjtotal2)
      }
      this.fwtjreserveprice = [
        {
          name: this.fwtjldata[0],
          value: 0
        },
        {
          name: this.fwtjldata[1],
          value: 0
        },
        {
          name: this.fwtjldata[2],
          value: 0
        },
        {
          name: this.fwtjldata[3],
          value: 0
        }
      ]
      for (var x of res.data.wdclassGroupList) {
        if (x.wdClass === '1') {
          this.fwtjreserveprice[0].value = parseInt(x.totalPrice)
        }
        if (x.wdClass === '3') {
          this.fwtjreserveprice[1].value = parseInt(x.totalPrice)
        }
        if (x.wdClass === '2') {
          this.fwtjreserveprice[2].value = parseInt(x.totalPrice)
        }
        if (x.wdClass === '7') {
          this.fwtjreserveprice[3].value = parseInt(x.totalPrice)
        }
      }

      // nlbz
      for (var y of res.data.areasubsidytargetList) {
        if (y.state === 1) {
          this.nlbzreserve = [
            {
              name: this.legenddata[0],
              value: parseInt(y.reserve1)
            },
            {
              name: this.legenddata[1],
              value: parseInt(y.reserve2)
            },
            {
              name: this.legenddata[2],
              value: parseInt(y.reserve3)
            },
            {
              name: this.legenddata[3],
              value: parseInt(y.reserve4)
            }
          ]
        }
      }

      // hrtj ['下单', '咨询', '投诉']
      this.hrtjreserve = [
        {
          name: this.hrtjdata[0],
          value: 0
        },
        {
          name: this.hrtjdata[1],
          value: 0
        },
        {
          name: this.hrtjdata[2],
          value: 0
        }
      ]
      for (var o of res.data.callmanageList) {
        if (o.callTypeStr === '下单') {
          this.hrtjreserve[0].value = o.id
        } else if (o.callTypeStr === '咨询') {
          this.hrtjreserve[1].value = o.id
        } else if (o.callTypeStr === '投诉') {
          this.hrtjreserve[2].value = o.id
        }
      }

      // hctj ['工单回访', '处理投诉', '处理任务', '处理预警', '直接拨打']
      this.hctjreserve = [
        {
          name: this.hctjdata[0],
          value: 0
        },
        {
          name: this.hctjdata[1],
          value: 0
        },
        {
          name: this.hctjdata[2],
          value: 0
        },
        {
          name: this.hctjdata[3],
          value: 0
        },
        {
          name: this.hctjdata[4],
          value: 0
        }
      ]
      for (var r of res.data.calloutmanageList) {
        if (r.calloutTypeStr === '工单回访') {
          this.hctjreserve[0].value = r.id
        } else if (r.calloutTypeStr === '处理投诉') {
          this.hctjreserve[1].value = r.id
        } else if (r.calloutTypeStr === '处理任务') {
          this.hctjreserve[2].value = r.id
        } else if (r.calloutTypeStr === '处理预警') {
          this.hctjreserve[3].value = r.id
        } else if (r.calloutTypeStr === '直接拨打') {
          this.hctjreserve[4].value = r.id
        }
      }

      this.callgroup = res.data.callgroup
    })

    // 进行的服务和服务统计30秒刷新一次数据
    this.timer()
  },
  methods: {
    getData() {
      getBigScreenData(allApi.large.getBigScreenData, {}).then(res => {
        // jxfw
        this.jxlist = res.data.latelyWorkorderList

        // fwtj 1:助餐 2:助洁 3:助医 7:远程照护 ['助餐', '助医', '助洁', '远程照护'],
        this.fwtjreserve = [
          {
            name: this.fwtjldata[0],
            value: 0
          },
          {
            name: this.fwtjldata[1],
            value: 0
          },
          {
            name: this.fwtjldata[2],
            value: 0
          },
          {
            name: this.fwtjldata[3],
            value: 0
          }
        ]
        for (var i of res.data.wdclassGroupList) {
          if (i.wdClass === '1') {
            this.fwtjreserve[0].value = i.count
          }
          if (i.wdClass === '3') {
            this.fwtjreserve[1].value = i.count
          }
          if (i.wdClass === '2') {
            this.fwtjreserve[2].value = i.count
          }
          if (i.wdClass === '7') {
            this.fwtjreserve[3].value = i.count
          }
        }

        // fwtj
        this.fwstate = res.data.wdstateGroupList

        // right
        for (var h of res.data.organizationList) {
          if (h.reserve1 === 'citySubsidy') {
            this.citySubsidy = h.id
          }
        }
        this.fwtjreserveprice = [
          {
            name: this.fwtjldata[0],
            value: 0
          },
          {
            name: this.fwtjldata[1],
            value: 0
          },
          {
            name: this.fwtjldata[2],
            value: 0
          },
          {
            name: this.fwtjldata[3],
            value: 0
          }
        ]
        for (var x of res.data.wdclassGroupList) {
          if (x.wdClass === '1') {
            this.fwtjreserveprice[0].value = parseInt(x.totalPrice)
          }
          if (x.wdClass === '3') {
            this.fwtjreserveprice[1].value = parseInt(x.totalPrice)
          }
          if (x.wdClass === '2') {
            this.fwtjreserveprice[2].value = parseInt(x.totalPrice)
          }
          if (x.wdClass === '7') {
            this.fwtjreserveprice[3].value = parseInt(x.totalPrice)
          }
        }
      })
    },
    timer() {
      return setInterval(() => {
        this.getData()
      }, 30000)
    }
  },
  destroyed() {
    clearInterval(this.timer)
  }
}
</script>

<style lang="scss" scoped>
.large-container /deep/ {
  background: #000070;
  color: #ffffff;
  width: 3200px;
  height: 1080px;
  padding: 0;
  text-align: left;
  // header
  .header {
    background: url('/static/images/large/header.png') no-repeat;
    background-size: 100% 100%;
    width: 3200px;
    height: 111px;
    line-height: 111px;
    font-size: 45px;
    text-align: center;
    letter-spacing: 4px;
  }

  .left_box > div .box,
  .right_box > div .box {
    width: 540px;
  }
}

.container {
  width: 100%;
  margin-top: 30px;
}

.container > div {
  float: left;
}

.center_box {
  width: 950px;
}

.left_box {
  margin-left: 20px;
}
</style>
