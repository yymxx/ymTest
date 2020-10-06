<template>
  <div>
    <div class="edit-box">
      <el-card class="oldNotes">
        <div slot="header">
          <span>老人信息详情</span>
        </div>
        <el-form :inline="true"
          :model="form"
          ref="form"
          label-width="135px">
          <el-tabs type="card">
            <el-tab-pane v-if="hhhhhhh"
              label="基本信息">
              <div class="detailbox"
                :style="{width: basicWidth}">
                <el-form-item label="老人姓名：">
                  <label class="detail">{{ form.oldName }}</label>
                </el-form-item>
                <el-form-item label="证件类型：">
                  <label class="detail">{{ form.idTypeStr }}</label>
                  <!-- <el-radio-group v-model="form.idType"
                    :style="{minWidth: '240px',maxWidth: '630px'}">
                    <el-radio v-for="(item, index) in allOptions.typeList"
                      :key="index"
                      :label="item.dicKey">{{ item.dicValue }}</el-radio>
                  </el-radio-group> -->
                </el-form-item>
                <el-form-item label="证件号码：">
                  <label class="detail">{{ form.idNumber }}</label>
                </el-form-item>
                <span class="avatar-box avatar-user">
                  <el-form-item label="头像：">
                    <div v-if="form.photo"
                      class="avatar-uploader">
                      <img :src="form.photo"
                        class="avatar">
                    </div>
                  </el-form-item>
                </span>
                <el-form-item label="性别：">
                  <label class="detail">{{ form.sexStr }}</label>
                  <!-- <el-radio-group v-model="form.sex"
                    :style="{minWidth: '240px',maxWidth: '630px'}">
                    <el-radio v-for="(item, index) in allOptions.sexList"
                      :key="index"
                      :label="item.dicKey">{{ item.dicValue }}</el-radio>
                  </el-radio-group> -->
                </el-form-item>
                <el-form-item label="年龄：">
                  <label class="detail">{{ form.age }}</label>
                </el-form-item>
                <el-form-item label="出生日期：">
                  <label class="detail">{{ form.birthday }}</label>
                </el-form-item>
                <el-form-item label="名族：">
                  <label class="detail">{{ form.cusNational }}</label>
                </el-form-item>
                <el-form-item label="文化程度：">
                  <label class="detail">{{ form.education }}</label>
                </el-form-item>
                <el-form-item label="婚姻状况：">
                  <label class="detail">{{ form.maritalStatus }}</label>
                </el-form-item>
                <el-form-item label="户口性质：">
                  <label class="detail">{{ form.householdRegister }}</label>
                </el-form-item>
                <el-form-item label="是否本地户籍：">
                  <label class="detail">{{ form.isLocalStr }}</label>
                </el-form-item>
                <el-form-item label="所属机构：">
                  <label class="detail">{{ form.reserve2 }}</label>
                </el-form-item>
                <el-form-item label="人员类型：">
                  <label class="detail">{{ form.personnelTypeStr }}</label>
                  <!-- <el-radio-group v-model="form.personnelType"
                    :style="{minWidth: '240px',maxWidth: '630px'}">
                    <el-radio v-for="(item, index) in allOptions.userList"
                      :key="index"
                      :label="item.dicKey">{{ item.dicValue }}</el-radio>
                  </el-radio-group> -->
                </el-form-item>
                <el-form-item label="户籍社区：">
                  <label class="detail">{{ form.censusRegister }}</label>
                </el-form-item>
                <el-form-item label="户籍地址：">
                  <label class="detail"
                    style="width: 630px">{{ form.address }}</label>
                </el-form-item>
                <el-form-item label="居住社区：">
                  <label class="detail">{{ form.reserve1 }}</label>
                </el-form-item>
                <el-form-item label="居住地址：">
                  <label class="detail"
                    style="width: 630px">{{ form.currentAddress }}</label>
                </el-form-item>
                <el-form-item label="预留电话：">
                  <label class="detail">{{ form.reservephone }}</label>
                </el-form-item>
                <el-form-item label="联系电话：">
                  <label class="detail">{{ form.telephone }}</label>
                </el-form-item>
                <el-form-item label="老人卡号：">
                  <label class="detail">{{ form.oldcard }}</label>
                </el-form-item>
                <!-- <span class="avatar-box">
                  <el-form-item label="身份证正面：">
                    <div v-if="form.idCardImg"
                      class="avatar-uploader">
                      <img :src="form.idCardImg"
                        class="avatar">
                    </div>
                  </el-form-item>
                </span> -->
              </div>
            </el-tab-pane>
            <el-tab-pane label="基本信息">
              <div class="inform-wrapper">
                <table width="100%"
                  cellpadding="0"
                  cellspacing="0"
                  border="0">
                  <tbody>
                    <td-cell label="老人姓名,证件类型"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.oldName }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.idTypeStr }}</div>
                    </td-cell>
                    <td-cell label="证件号码,性别"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.idNumber }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.sexStr }}</div>
                    </td-cell>
                    <td-cell label="年龄,出生日期"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.age }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.birthday }}</div>
                    </td-cell>
                    <td-cell label="名族,文化程度"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.cusNational }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.education }}</div>
                    </td-cell>
                    <td-cell label="婚姻状况,户口性质"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.maritalStatus }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.householdRegister }}</div>
                    </td-cell>
                    <td-cell label="是否本地户籍,所属机构"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.isLocalStr }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.reserve2 }}</div>
                    </td-cell>
                    <td-cell label="人员类型,老人卡号"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.personnelTypeStr }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.oldcard }}</div>
                    </td-cell>
                    <td-cell label="户籍社区,户籍地址"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.censusRegister }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.address }}</div>
                    </td-cell>
                    <td-cell label="居住社区,居住地址"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.reserve1 }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.currentAddress }}</div>
                    </td-cell>
                    <td-cell label="预留电话,联系电话"
                      cols="2,3,2,3">
                      <div class="td-box">{{ form.reservephone }}</div>
                      <div slot="my-right"
                        class="td-box">{{ form.telephone }}</div>
                    </td-cell>
                    <!-- <td-cell label="居住地址"
                      cols="2,8">
                      <div class="td-box">{{ form.adress }}</div>
                    </td-cell> -->
                  </tbody>
                </table>
                <div v-if="form.photo"
                  class="avatar-uploader">
                  <img :src="form.photo"
                    class="avatar">
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <div class="edit-btn">
          <el-button type="primary"
            @click="handleCancel">返 回</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { getOlderById } from '@/api/older'
import tdCell from './cell'

const older = {
  id: null,
  oldName: '',
  idType: '',
  idNumber: '',
  address: '',
  sex: '',
  age: '',
  birthday: '',
  censusRegister: '',
  currentAddress: '',
  isLocal: '',
  orgid: '',
  personnelType: '',
  reservephone: '',
  telephone: '',
  photo: '',
  reserve1: '',
  reserve2: '',
  personnelTypeStr: '',
  sexStr: '',
  idTypeStr: '',
  isLocalStr: '',
  oldcard: '',
  maritalStatus: '',
  cusNational: '',
  householdRegister: '',
  education: ''
}

const allOptions = {
  sexList: [
    {
      dicKey: 1,
      dicValue: '男性'
    },
    {
      dicKey: 0,
      dicValue: '女性'
    }
  ],
  userList: [
    {
      dicKey: 1,
      dicValue: '低保老人'
    },
    {
      dicKey: 0,
      dicValue: '残疾老人'
    }
  ],
  typeList: [
    {
      dicKey: 1,
      dicValue: '居民身份证'
    },
    {
      dicKey: 0,
      dicValue: '其他'
    }
  ]
}

export default {
  name: 'olderDetail',
  components: {
    tdCell
  },
  data() {
    return {
      basicWidth: '1600px',
      form: { ...older },
      allOptions,
      hhhhhhh: false
    }
  },
  props: ['ownPath'],
  created() {
    const olderId = this.$route.query.olderId
    getOlderById(olderId).then(response => {
      console.log(response)
      if (response.data) {
        for (const key in this.form) {
          this.form[key] = response.data[key] ? response.data[key] : ''
        }
      }
    })
  },
  mounted() {
    const that = this
    window.screenWidth = document.body.clientWidth
    that.basicWidth = window.screenWidth < 1800 ? 1168 + 'px' : 1555 + 'px'
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth
        that.basicWidth = window.screenWidth < 1800 ? 1168 + 'px' : 1555 + 'px'
      })()
    }
  },
  methods: {
    handleCancel() {
      this.$emit('setGoback', false)
      this.$router.push({
        path: this.ownPath
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-box {
  text-align: left;
  .el-tabs /deep/ {
    .el-tabs__item {
      width: 194px;
      text-align: center;
    }

    .is-active {
      color: #fff;
      background-color: #00a1ea;
    }
  }

  .detailbox {
    padding-bottom: 30px;
    .el-form-item {
      margin-bottom: 10px;
      .detail {
        width: 240px;
        display: inline-block;
      }
    }
  }

  .avatar-box {
    min-width: 375px;
    display: inline-block;
    .el-form-item /deep/ {
      margin-bottom: 0;
      .avatar-uploader {
        display: table-cell;
        vertical-align: top;
        .el-upload {
          margin-right: 15px;
          .avatar-uploader-icon {
            width: 50px;
            height: 50px;
            line-height: 50px;
          }
        }

        .avatar {
          height: 120px;
          vertical-align: top;
        }

        .cardImg-box {
          .avatar {
            height: 240px;
          }
        }
      }
    }
  }

  .avatar-user {
    float: right;
    width: 389px;
    height: 130px;
  }

  .group-box {
    width: 750px;
  }

  .el-radio-group /deep/ {
    .el-radio-button {
      margin-right: 10px;
      .el-radio-button__inner {
        border-left: 1px solid #dcdfe6;
      }

      .text {
        height: 26px;
        line-height: 26px;
      }
    }

    .is-active {
      .el-radio-button__inner {
        border-left-color: transparent;
      }
    }
  }

  .total {
    margin: 10px 0;
    label {
      display: inline-block;
    }

    .item {
      width: 135px;
      text-align: right;
      padding-right: 12px;
    }
  }

  .edit-btn {
    text-align: center;
  }
}

.inform-wrapper {
  border-top: 1px solid #dcdfe6;
  border-left: 1px solid #dcdfe6;
  font-size: 12px;
  margin-bottom: 20px;
  padding-right: 180px;
  position: relative;
  .avatar-uploader {
    position: absolute;
    top: 15px;
    right: 15px;
    .avatar {
      width: 150px;
      height: auto;
      vertical-align: top;
    }
  }

  .td-box {
    padding: 10px 20px;
    line-height: 22px;
    .el-radio-group {
      .el-radio {
        height: 22px;
        padding-top: 3px;
      }
    }
  }
}
</style>
