<template>
  <tr>
    <td v-if="num"
      :rowspan="getRowspan(num)">
      <div class="td-center">{{ tolName }}</div>
    </td>
    <td v-if="colist[0]!='2'">
      <div class="td-center">{{ myNames[0] }}</div>
    </td>
    <td v-else
      colspan="2">
      <div class="td-center">{{ myNames[0] }}</div>
    </td>
    <td :colspan="colist[1]">
      <slot></slot>
    </td>
    <td v-if="colist[2]"
      :colspan="colist[2]">
      <div class="td-center">{{ myNames[1] }}</div>
    </td>
    <td v-if="colist[3]"
      :colspan="colist[3]">
      <slot name="my-right"></slot>
    </td>
  </tr>
</template>

<script>
export default {
  name: 'tdCell',
  data() {
    return {
      tolName: '',
      colist: [],
      myNames: []
    }
  },
  props: ['label', 'cols', 'num'],
  mounted() {
    this.myNames = this.label.split(',')
    this.colist = this.cols.split(',')
    if (this.num) {
      this.tolName = this.num.substring(this.num.indexOf('-') + 1)
    }
  },
  methods: {
    getRowspan(res) {
      return parseInt(res)
    }
  }
}
</script>

<style lang="scss" scoped>
td {
  border-right: 1px solid #dcdfe6;
  border-bottom: 1px solid #dcdfe6;
  min-width: 90px;

  .td-center {
    line-height: 40px;
    text-align: center;
  }
}
</style>
