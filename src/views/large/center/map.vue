<template>
    <div class="map">
        <div class="pop pop1">
            <div class="map_pop">
                <p>张湾</p>
                <div>
                    <span>老人:</span>
                    <span>9405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>72426</span>
                </div>
            </div>
        </div>
        <div class="pop pop2">
            <div class="map_pop">
                <p>洪湖街</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop3">
            <div class="map_pop"
                style="top: 20px;">
                <p>索河镇</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop4">
            <div class="map_pop"
                style="top: 32px;">
                <p>永安街</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop5">
            <div class="map_pop"
                style="left: 20px;top: 20px;">
                <p>大集街</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop6">
            <div class="map_pop"
                style="left: -2px;">
                <p>蔡甸街</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop7">
            <div class="map_pop">
                <p>侏儒山街</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop8">
            <div class="map_pop"
                style="top: 115px;">
                <p>开发区</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop9">
            <div class="map_pop"
                style="left: -31px;">
                <p>乡</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop10">
            <div class="map_pop">
                <p>农场</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
        <div class="pop pop11">
            <div class="map_pop">
                <p>玉贤镇</p>
                <div>
                    <span>老人:</span>
                    <span>10405</span>
                </div>
                <div>
                    <span>服务:</span>
                    <span>85426</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import $ from 'jquery'
export default {
  name: 'HelloWorld',
  data() {
    return {}
  },
  mounted() {
    $('.pop').each(function() {
      $(this).mouseover(function() {
        $(this)
          .children()
          .css('display', 'block')
      })
      $(this).mouseout(function() {
        $(this)
          .children()
          .css('display', 'none')
      })
    })
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.map {
  width: 900px;
  margin: 0 auto;
  position: relative;
  margin-top: -70px;
}

.map_pop {
  display: none;
  width: 160px;
  height: 90px;
  background: rgba(0, 0, 0, 0.3);
  z-index: 10;
  position: absolute;
  left: 50px;
  top: 50px;
}

.map_pop p {
  text-align: center;
  margin-top: 5px;
  font-size: 18px;
}

.map_pop div {
  text-align: center;
  margin: 5px 0;
  font-size: 16px;
}

.pop {
  background: url('/static/images/large/map1.png') no-repeat;
  background-size: 100% 100%;
  position: absolute;
  cursor: pointer;
  z-index: 1;
}

.pop1 {
  background-image: url('/static/images/large/map1.png');
  width: 375px;
  height: 193px;
  top: 303px;
  left: 46px;
}

.pop2 {
  background-image: url('/static/images/large/map2.png');
  width: 223px;
  height: 245px;
  top: 92px;
  right: 112px;
}

.pop3 {
  background-image: url('/static/images/large/map3.png');
  width: 250px;
  height: 143px;
  top: 234px;
  right: 301px;
}

.pop4 {
  background-image: url('/static/images/large/map4.png');
  width: 255px;
  height: 209px;
  top: 305px;
  right: 8px;
}

.pop5 {
  background-image: url('/static/images/large/map5.png');
  width: 214px;
  height: 132px;
  top: 325px;
  right: 210px;
}

.pop6 {
  background-image: url('/static/images/large/map6.png');
  width: 177px;
  height: 219px;
  top: 362px;
  right: 350px;
}

.pop7 {
  background-image: url('/static/images/large/map7.png');
  width: 212px;
  height: 181px;
  top: 424px;
  left: 179px;
  z-index: 2;
}

.pop8 {
  background-image: url('/static/images/large/map8.png');
  width: 332px;
  height: 298px;
  top: 440px;
  left: 21px;
}

.pop9 {
  background-image: url('/static/images/large/map9.png');
  width: 150px;
  height: 149px;
  top: 569px;
  left: 349px;
}

.pop10 {
  background-image: url('/static/images/large/map10.png');
  width: 229px;
  height: 313px;
  top: 437px;
  right: 241px;
}

.pop11 {
  background-image: url('/static/images/large/map11.png');
  width: 242px;
  height: 165px;
  top: 426px;
  right: 66px;
}
</style>
