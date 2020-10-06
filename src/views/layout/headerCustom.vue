<template>
  <div class="app-wrapper">
    <div v-if="noShout=='large'"></div>
    <div v-else-if="noShout=='call'||noShout=='shout'"
      class="app-header clearfix">
      <div class="call-head">
        <!-- <div style="padding: 15px 0 0 20px;">
          <shout-call></shout-call>
        </div> -->
      </div>
      <div class="logo">
        <span class="titcall">{{ title }}</span>
      </div>
      <div class="content-user">
        <div class="hint-box">
          <div style="margin-top: 18px;">
            <div style="display: inline-block;">
              <shout-call></shout-call>
            </div>
            <el-button v-if="signIn"
              type="info">签入</el-button>
            <el-button v-else
              type="warning"
              @click="checkInOut('in')"
              plain>签入</el-button>
            <el-button v-if="signIn"
              type="warning"
              @click="checkInOut('out')"
              plain>签出</el-button>
            <el-button v-else
              type="info">签出</el-button>
            <el-button type="warning"
              plain>忙碌</el-button>
          </div>
        </div>
        <!-- 用户管理 -->
        <el-dropdown title="用户信息"
          trigger="click"
          style="cursor: pointer;">
          <div class="admin-user">
            <svg-icon icon-class="user-circle"
              style="color: #fff; font-size: 35px;" />
            <span class="user-text">
              <div>欢迎</div>
              {{sysUser.name}}
            </span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span style="display:block;">手册下载</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="handelUpdate"
                style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout"
                style="display:block;">
                <svg-icon icon-class="out"></svg-icon>
                <span>退出</span>
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div v-else
      class="app-header clearfix">
      <div class="logo">
        <!-- <img :src="logo" /> -->
        <span class="titlog">{{ title }}</span>
      </div>
      <div v-if="menus.length>0"
        class="nav">
        <router-link v-for="(item, index) in menus"
          :key="index"
          :to="item.path"
          class="item"
          active-class="isActive">{{item.title}}</router-link>
        <span class="itemhh">审批管理</span>
        <span class="itemhh">物联网+</span>
      </div>
      <div class="content-user">
        <div class="hint-box">
          <router-link class="put-link"
            to="/dossier/editelder"
            active-class="isActive">
            <el-badge is-dot
              class="item">
              <svg-icon icon-class="notice"></svg-icon>
              <span>通知</span>
            </el-badge>
          </router-link>
          <!-- <router-link class="put-link"
            to="/dossier/editelder"
            active-class="isActive">
            <span>帮助提示</span>
            </router-link> -->
        </div>
        <!-- 用户管理 -->
        <el-dropdown title="用户信息"
          trigger="click"
          style="cursor: pointer;">
          <div class="admin-user">
            <svg-icon icon-class="user-circle"
              style="color: #fff; font-size: 35px;" />
            <span class="user-text">
              <div>欢迎</div>
              {{sysUser.name}}
            </span>
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <span style="display:block;">手册下载</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="handelUpdate"
                style="display:block;">修改密码</span>
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span @click="logout"
                style="display:block;">
                <svg-icon icon-class="out"></svg-icon>
                <span>退出</span>
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <router-view></router-view>

    <el-dialog title="修改密码"
      :visible.sync="dialogFormVisible"
      @close="clearFormValidate('form')"
      :close-on-click-modal="false"
      width="400px">
      <el-form :model="form"
        :rules="rules"
        ref="form"
        label-width="100px">
        <el-form-item label="旧密码"
          prop="oldUserPwd">
          <el-input :type="passwordType"
            v-model="form.oldUserPwd"
            placeholder="请输入旧密码"
            style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item label="新密码"
          prop="newUserPwd">
          <el-input :type="passwordType"
            v-model="form.newUserPwd"
            placeholder="请输入新密码"
            style="width: 200px"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
        class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary"
          @click="updatePwd('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { updateRecord } from '@/api/page'
import { allApi } from '@/api/config'
import shoutCall from '@/components/ShoutCall'
import { mapGetters } from 'vuex'

export default {
  name: 'HelloWorld',
  components: {
    shoutCall
  },
  data() {
    return {
      logo: './static/images/logo.png',
      title: '蔡甸区‘互联网+居家养老’信息平台',
      noShout: '',
      signIn: 0,
      dialogFormVisible: false,
      passwordType: 'password',
      form: {
        oldUserPwd: '',
        newUserPwd: ''
      },
      rules: {
        oldUserPwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ],
        newUserPwd: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['menus', 'sysUser', 'voip'])
  },
  watch: {
    $route(val) {
      const rlist = val.path.split('/')
      this.noShout = rlist[1]
    }
  },
  mounted() {
    const rlist = this.$route.path.split('/')
    this.noShout = rlist[1]
    console.log(this.noShout)
  },
  methods: {
    checkInOut(val) {
      const that = this
      const voip = this.voip
      voip.setUserCheckInOut(this.signIn, function(data) {
        if (parseInt(data.code) === 0) {
          if (that.signIn === 0) {
            that.signIn = 1
            that.$message({
              type: 'success',
              message: '签入成功'
            })
          } else {
            that.signIn = 0
            that.$message({
              type: 'success',
              message: '签出成功'
            })
          }
        }
      })
    },
    handelUpdate() {
      this.dialogFormVisible = true
    },
    updatePwd(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          const apiUrl = allApi.sys.user.modifyWd
          updateRecord(apiUrl, {
            id: this.sysUser.id,
            oldPasswd: this.form.oldUserPwd,
            passWd: this.form.newUserPwd
          }).then(res => {
            if (res.data === 1) {
              this.$notify({
                title: '成功',
                message: '修改密码成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        } else {
          return false
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload()
      })
    },
    cancel() {
      this.dialogFormVisible = false
    },
    clearFormValidate(formName) {
      this.$refs[formName].clearValidate()
    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  min-width: 1720px;
  .app-header {
    background: #2095ed;
    text-align: left;
    position: relative;
    .logo {
      float: left;
      height: 75px;
      img {
        margin-top: 10px;
        margin-left: 10px;
        height: 40px;
        vertical-align: middle;
      }

      .titlog {
        margin-left: 23px;
        margin-right: 28px;
        width: 150px;
        line-height: 27px;
      }

      .titcall {
        font-size: 20px;
        position: absolute;
        left: 20px;
        top: 0;
      }

      span {
        display: inline-block;
        margin-top: 10px;
        line-height: 52px;
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        vertical-align: middle;
      }
    }

    .nav {
      height: 40px;
      line-height: 40px;
      display: inline-block;
      vertical-align: bottom;
      margin-top: 35px;
      .item {
        float: left;
        display: block;
        padding: 0 16px;
        color: #fff;
        border-radius: 5px;
      }

      .itemhh {
        float: left;
        display: block;
        padding: 0 16px;
        color: #bbb;
        border-radius: 5px;
      }

      .isActive {
        background: #30cee1;
      }
    }

    .call-head {
      float: left;
      height: 75px;
    }

    .content-user {
      float: right;
      padding-right: 25px;
      font-size: 0;
      .hint-box {
        height: 75px;
        display: inline-block;
        vertical-align: middle;
        .put-link {
          margin: 26px 12px 0;
          display: inline-block;
          vertical-align: bottom;
          .svg-icon {
            color: #fff;
            font-size: 18px;
            margin-right: 3px;
          }

          span {
            color: #fff;
            font-size: 14px;
          }
        }
      }

      .el-dropdown {
        padding-left: 20px;
        vertical-align: middle;
        .admin-user {
          font-size: 14px;
          color: #fff;
          padding: 5px 0;
          .svg-icon {
            width: 40px;
            height: 40px;
            vertical-align: middle;
          }

          .user-text {
            display: inline-block;
            vertical-align: middle;
            margin-left: 5px;
            line-height: 21px;
          }
        }
      }
    }
  }
}
</style>
