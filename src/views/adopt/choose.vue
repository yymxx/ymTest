<template>
  <div>
    <div class="check-container">
      <div v-if="isRadio"
        class="check-wrapper">
        <div class="check-group">
          <el-radio-group v-model="checkValue">
            <div v-for="(item, index) in list"
              :key="index"
              class="groupbox"
              :style="{width: groupWt}">
              <el-radio :label="item[elProps.key]">
                {{ item[elProps.label] }}
              </el-radio>
            </div>
            <div style="clear: both;"></div>
          </el-radio-group>
        </div>
      </div>
      <div v-else
        class="check-wrapper">
        <div style="height: 42px;">
          <el-checkbox :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleAllChange">全选</el-checkbox>
        </div>
        <div class="check-group">
          <el-checkbox-group v-model="checkList"
            @change="handleChecked">
            <div v-for="(item, index) in list"
              :key="index"
              class="groupbox"
              :style="{width: groupWt}">
              <el-checkbox :label="item[elProps.key]">
                {{ item[elProps.label] }}
              </el-checkbox>
            </div>
            <div style="clear: both;"></div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div style="text-align: right;">
      <el-button @click="cancel()">取 消</el-button>
      <el-button type="primary"
        @click="update()">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'publicChoose',
  data() {
    return {
      list: [
        {
          id: 1,
          oldName: '呵呵'
        }
      ],
      elProps: {
        key: 'id',
        label: 'oldName'
      },
      isRadio: false,
      groupWt: '120px',
      checkValue: '',
      checkList: [],
      checkAll: false,
      isIndeterminate: false
    }
  },
  props: ['width', 'data', 'multiple', 'chooseList', 'checkProps'],
  mounted() {
    if (this.chooseList) this.list = this.chooseList
    if (this.checkProps) this.elProps = this.checkProps
    if (this.width) this.groupWt = this.width
    console.log(this.elProps)
    this.isRadio = this.multiple === undefined
    if (this.data) this.checkValue = this.data
    if (this.data && this.multiple !== undefined) {
      this.isIndeterminate = this.data !== ''
      this.checkList = this.data.split(',').map(item => {
        return parseInt(item)
      })
    }
  },
  methods: {
    handleAllChange(val) {
      this.isIndeterminate = false
      const allIds = this.list.reduce((res, item) => {
        return res.concat([item.id])
      }, [])
      this.checkList = val ? allIds : []
    },
    handleChecked(value) {
      const count = value.length
      this.checkAll = count === this.list.length
      this.isIndeterminate = count > 0 && count < this.list.length
    },
    update() {
      if (this.isRadio) {
        const key = this.checkValue
        const obj = this.list.find(item => item[this.elProps.key] === key)
        if (obj) this.checkValue = key + '-' + obj[this.elProps.label]
        this.$emit('setGoback', this.checkValue)
      } else {
        let key = this.checkValue
        const checkName = this.list.reduce((res, item) => {
          key = item[this.elProps.key]
          if (this.checkList.find(v => v === key)) {
            return res.concat(key + '-' + item[this.elProps.label])
          }
          return res
        }, [])

        this.checkValue = checkName.join()
        this.$emit('setGoback', this.checkValue)
      }
    },
    cancel() {
      this.$emit('setGoback', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.check-container {
  position: relative;
  top: -10px;
  .check-wrapper {
    padding: 0 20px 0 50px;
    .check-group {
      max-height: 452px;
      overflow-y: auto;
      .groupbox {
        width: 118px;
        float: left;
        .el-checkbox {
          height: 28px;
        }

        .el-radio {
          height: 28px;
        }
      }
    }
  }
}
</style>
