<template>
  <div>
    <div class="left">
      <!-- bzze -->
      <bzze :citySubsidy="citySubsidy"
        :SubsidyCount="SubsidyCount"></bzze>
      <!-- nlbz -->
      <nlbz :nlbzreserve="nlbzreserve"
        :legenddata="legenddata"></nlbz>
      <!-- fwzb -->
      <fwzb :fwtjreserve="fwtjreserveprice"
        :fwtjldata="fwtjldata"></fwzb>
    </div>
    <div class="left">
      <!-- hjfx -->
      <hjfx :callgroup="callgroup"></hjfx>
      <!-- hrtj -->
      <hrtj :hrtjreserve="hrtjreserve"
        :hrtjdata="hrtjdata"></hrtj>
      <!-- hctj -->
      <hctj :hctjreserve="hctjreserve"
        :hctjdata="hctjdata"></hctj>
    </div>
  </div>
</template>

<script>
import bzze from './bzze'
import nlbz from './nlbz'
import fwzb from './fwzb'
import hjfx from './hjfx'
import hrtj from './hrtj'
import hctj from './hctj'

export default {
  name: 'HelloWorld',
  components: {
    bzze,
    nlbz,
    fwzb,
    hjfx,
    hrtj,
    hctj
  },
  props: [
    'citySubsidy',
    'fwtjreserveprice',
    'fwtjldata',
    'SubsidyCount',
    'nlbzreserve',
    'legenddata',
    'hrtjreserve',
    'hrtjdata',
    'hctjreserve',
    'hctjdata',
    'callgroup'
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
