<template>
  <div class="box jxfw">
    <span class="top"></span>
    <span class="left"></span>
    <span class="right"></span>
    <span class="bottom"></span>
    <div class="txt">
      <h2>进行的服务</h2>
      <div class="text-container">
        <ul class="inner-container">
          <li v-for="(text, index) in arr"
            :key="index">{{text}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data() {
    return {
      arr: [],
      number: 0
    }
  },
  props: ['jxlist'],
  computed: {
    text() {
      return {
        id: this.number,
        val: this.arr[this.number]
      }
    }
  },
  mounted() {
    this.getArr(this.jxlist)
    this.startMove()
  },
  watch: {
    jxlist(val) {
      this.getArr(val)
    }
  },
  methods: {
    startMove() {
      setTimeout(() => {
        if (this.number === 9) {
          this.number = 0
        } else {
          this.number += 1
        }
        this.startMove()
      }, 3000)
    },
    getArr(arr) {
      for (const i of arr) {
        if (i.updateTime) {
          let item =
            i.updateTime.substring(0, 10) +
            '  ' +
            i.oldName +
            ' "' +
            this.gettype(i.wdClass) +
            '" ' +
            '工单 ' +
            this.getstate(i.wdState)
          this.arr.push(item)
        }
      }
    },
    getstate(s) {
      if (s === 1) {
        return '待派单'
      } else if (s === 2) {
        return '待服务'
      } else if (s === 3) {
        return '进行中'
      } else if (s === 4) {
        return '待回访'
      } else if (s === 5) {
        return '异常'
      } else if (s === 6) {
        return '待结算'
      } else if (s === 7) {
        return '已结算'
      }
    },
    gettype(t) {
      if (t === 1) {
        return '助餐'
      } else if (t === 2) {
        return '助洁'
      } else if (t === 3) {
        return '助医'
      } else if (t === 4) {
        return '远程照护'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
ol,
li {
  list-style: none;
}

.box {
  border: 1px solid #3486da;
  background: #022a8f;
  position: relative;
  border-radius: 6px;
}

.box .top {
  position: absolute;
  top: -1px;
  left: -1px;
  background: url('/static/images/large/border1.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

.box .left {
  position: absolute;
  top: -1px;
  right: -1px;
  background: url('/static/images/large/border2.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

.box .right {
  position: absolute;
  bottom: -1px;
  left: -1px;
  background: url('/static/images/large/border3.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

.box .bottom {
  position: absolute;
  bottom: -1px;
  right: -1px;
  background: url('/static/images/large/border4.png') no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
}

.txt > h2 {
  margin: 15px 0 0 15px;
  font-size: 20px;
  letter-spacing: 1px;
}

.txt > h2:before {
  content: '';
  display: inline-block;
  background: url('/static/images/large/title.png') no-repeat;
  background-size: 100% 100%;
  width: 10px;
  height: 35px;
  vertical-align: middle;
  margin-right: 10px;
}

.jxfw {
  height: 340px;
  margin-bottom: 20px;
}

.jxfw ul {
  padding: 20px 30px;
  font-size: 20px;
  margin: 0;
}

.jxfw ul li {
  border-bottom: 1px dashed #7273fd;
  line-height: 45px;
  margin-bottom: 5px;
  letter-spacing: 1px;
}

.jxfw ul li span {
  letter-spacing: 1px;
}

.text-container {
  width: 500px;
  height: 270px;
  line-height: 30px;
  margin: 10px auto;
  overflow: hidden;
}

.inner-container {
  animation: myMove 10s linear infinite;
  animation-fill-mode: forwards;
}
@keyframes myMove {
  0% {
    transform: translateY(0);
  }
  10% {
    transform: translateY(-30px);
  }
  20% {
    transform: translateY(-60px);
  }
  30% {
    transform: translateY(-90px);
  }
  40% {
    transform: translateY(-120px);
  }
  50% {
    transform: translateY(-150px);
  }
  60% {
    transform: translateY(-180px);
  }
  70% {
    transform: translateY(-210px);
  }
  80% {
    transform: translateY(-240px);
  }
  90% {
    transform: translateY(-255px);
  }
  100% {
    transform: translateY(-270px);
  }
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s linear;
}
.slide-leave-to {
  transform: translateY(-20px);
}
.slide-enter {
  transform: translateY(20px);
}
</style>
