<template>
  <div class="main-container">
    <span>正在创建中...</span>
    <div class="calendar">
      <!-- <ele-calendar prop="date"
        :render-content="renderContent"
        :data="datedef"></ele-calendar> -->
    </div>

    <el-autocomplete v-if="dialogMapShow"
      class="inline-input"
      v-model="dataForm.tableName"
      :fetch-suggestions="queryByRuleName"
      placeholder="预置模板"
      @select="handleSelect"
      size="mini"></el-autocomplete>

    <el-dialog width="800px"
      title="点击地图选择地址"
      :visible.sync="dialogMapShow"
      :close-on-click-modal="false">
      <div v-if="dialogMapShow">
        <div class="filter-container">
          <el-input id="nickName"
            class="filter-input"
            v-model="seekCity"
            name="keyword"
            placeholder="请输入搜索条件"
            style="width: 360px;margin-right: 20px;">
            <template slot="prepend">关键字</template>
          </el-input>
        </div>
        <div id="allmap"
          style="width: 100%;height: 430px;"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import eleCalendar from 'ele-calendar'
import 'ele-calendar/dist/vue-calendar.css'
import AMap from 'AMap'

export default {
  name: 'HelloWorld',
  components: {
    eleCalendar
  },
  data() {
    return {
      btnPowers: null,
      map: null,
      geocoder: null,
      seekCity: '',
      dialogMapShow: false,
      dataForm: {
        id: 0,
        tableName: '',
        typeName: '',
        dataKey: ''
      },
      datedef: [
        { date: '2018-06-30', content: null, cid: null },
        { date: '2018-06-26', content: null, cid: null }
      ]
    }
  },
  watch: {
    dialogMapShow(curVal, oldVal) {
      if (curVal) {
        this.$nextTick(() => {
          this.map = new AMap.Map('allmap', {
            resizeEnable: true,
            zoom: 11,
            center: [114.264669, 30.549972]
          })

          const map = this.map
          AMap.event.addListener(map, 'click', function() {
            alert('click')
          })

          let auto = new AMap.Autocomplete({
            input: 'nickName',
            city: '武汉市',
            datatype: 'poi',
            citylimit: true
          })

          console.log(auto)

          AMap.event.addListener(auto, 'select', function(res) {
            console.log('location', res.poi.location)
            if (res.poi && res.poi.location) {
              map.setZoom(15)
              map.setCenter(res.poi.location)
              let lnglat = [res.poi.location.lng, res.poi.location.lat]
              map.add(
                new AMap.Marker({
                  icon:
                    'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
                  position: lnglat
                })
              )
            }
          })
        })
      }
    }
  },
  created() {
    this.btnPowers = this.$route.meta.btnList
    console.log('btnPowers', this.btnPowers)
  },
  mounted() {
    // this.dialogMapShow = true
  },
  methods: {
    queryByRuleName(queryString, callback) {
      let rlist = [
        {
          id: 0,
          tableName: '111',
          typeName: '111',
          dataKey: '111'
        }
      ]

      callback(rlist)
    },
    handleSelect(item) {
      console.log(item)
    },
    renderContent(h, data) {
      return data.defvalue.value ? (
        <div class="picker">
          <div>{data.defvalue.text}</div>
          <span>备选项</span>
        </div>
      ) : (
        <div class="picker">
          <span>{data.defvalue.text}</span>
        </div>
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar /deep/ {
  width: 600px;
  margin: 50px;
  .el-date-picker-calendar {
    padding: 20px 30px;
    .el-date-table-calendar {
      text-align: center;
      td {
        font-size: 14px;
        border-radius: 40px;
        .picker {
          display: flex;
          min-height: 60px;
          align-items: center;
          justify-content: center;
        }
      }

      .today {
        font-size: 22px;
      }
    }
  }
}
</style>
