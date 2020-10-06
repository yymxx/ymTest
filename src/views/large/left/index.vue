<template>
  <div>
    <div class="left">
      <!-- lrxx -->
      <lrxx :legenddata="legenddata"
        :reserve="reserve"
        :maleCount="maleCount"
        :femaleCount="femaleCount"></lrxx>
      <!-- jzqk -->
      <jzqk :jzqkreserve="jzqkreserve"
        :jzqkldata="jzqkldata"></jzqk>
    </div>
    <div class="left">
      <!-- jxfw -->
      <jxfw :jxlist="jxlist"></jxfw>
      <!-- fwtj -->
      <fwtj :fwtjreserve="fwtjreserve"
        :fwtjldata="fwtjldata"
        :fwstate="fwstate"></fwtj>
    </div>
  </div>
</template>

<script>
import lrxx from './lrxx'
import jzqk from './jzqk'
import jxfw from './jxfw'
import fwtj from './fwtj'

export default {
  name: 'HelloWorld',
  components: {
    lrxx,
    jzqk,
    jxfw,
    fwtj
  },
  props: [
    'reserve',
    'legenddata',
    'jzqkreserve',
    'jzqkldata',
    'fwtjreserve',
    'fwtjldata',
    'fwstate',
    'jxlist',
    'maleCount',
    'femaleCount',
    'latelyWorkorderList',
    'wdclassGroupList',
    'wdstateGroupList'
  ],
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.left {
  float: left;
}
</style>
