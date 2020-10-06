<template>
  <div class="login-container">
    <div class="box">
      <div class="img-box">
        <img src="/static/images/login/img.png" />
        <div class="phone-box">
          <span class="icon"></span>
          <span class="txt">服务热线：</span>
          <span class="num">027-51009009</span>
        </div>
      </div>
      <div class="box-group">
        <!-- <svg-icon icon-class="user" /> -->
        <el-form class="login-form"
          autoComplete="on"
          :model="loginForm"
          :rules="loginRules"
          ref="loginForm"
          label-position="left">
          <div class="title-container">
            <span class="title">蔡甸区'互联网+居家养老'信息平台</span>
          </div>
          <div style="width: 400px;margin: 0 auto;">
            <el-form-item prop="userName">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input name="username"
                autofocus
                type="text"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.userName"
                placeholder="请输入账号" />
            </el-form-item>
            <el-form-item prop="userPwd">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input name="password"
                :type="passwordType"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.userPwd"
                placeholder="请输入密码" />
            </el-form-item>
            <el-button class="loginBtn"
              type="primary"
              :loading="loading"
              @click.native.prevent="handleLogin"
              style="width: 400px;">登 录</el-button>
            <span class="password">忘记密码</span>
            <div class="app-box">
              <div class="icon-box">
                <span class="icon icon1"></span>
                <span class="txt">助老员APP</span>
              </div>
              <div class="icon-box">
                <span class="icon icon2"></span>
                <span class="txt">微信公众号</span>
              </div>
            </div>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 3) {
        callback(new Error('密码不能少于3位'))
      } else {
        callback()
      }
    }

    return {
      passwordType: 'password',
      loading: false,
      loginForm: {
        userName: '',
        userPwd: ''
      },
      loginRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      }
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('LoginByUser', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.loading = false
              // this.$message.error('账号或密码错误')
              // this.$store.dispatch('IninMenu').then(() => {
              //   this.$router.push({ path: '/' })
              // })
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  // height: 100%;
  // position: relative;
  // background: url('/static/images/bg.jpg') left center no-repeat #fff;
  // background-size: 53% auto;
  .box-group {
    // width: 420px;
    // padding: 40px;
    // position: absolute;
    // top: 50%;
    // right: 18%;
    // margin-top: -200px;
    flex: 1;
    .title-container {
      font-size: 26px;
      font-weight: 700;
      font-family: '黑体';
      margin-top: 20px;
    }

    .password {
      float: right;
      margin: 30px 8px 0;
      cursor: pointer;
    }
    .app-box {
      clear: both;
      margin-top: 115px;
      display: flex;
      .icon-box {
        flex: 1;
        cursor: pointer;
        span {
          vertical-align: middle;
          &.icon {
            display: inline-block;
            width: 32px;
            height: 32px;
            background: url('/static/images/login/down.png') no-repeat;
            background-size: 100% 100%;
            &.icon2 {
              background: url('/static/images/login/msg.png') no-repeat;
            }
          }
          &.txt {
            margin-left: 5px;
          }
        }
      }
    }

    .el-form /deep/ {
      .el-form-item {
        margin-top: 45px;
        margin-bottom: 20px;
        .el-form-item__content {
          height: 40px;
          .svg-container {
            position: absolute;
            left: 7px;
            top: 2px;
            z-index: 10;
            width: 40px;
            font-size: 20px;
            color: #aaa;
            vertical-align: middle;
          }

          .el-input {
            font-size: 14px;
            vertical-align: middle;
            .el-input__inner {
              border: 2px solid #eee;
              border-bottom: 1px solid #eee;
              border-radius: 25px;
              padding-left: 45px;
              font-size: 18px;
              height: 46px;
              line-height: 46px;
            }
          }
        }

        .el-form-item__error {
          left: 36px;
          top: 120%;
          font-size: 16px;
        }
      }

      .loginBtn {
        margin-top: 30px;
        font-size: 20px;
        background: #6283f7;
        border-radius: 25px;
      }
    }
  }
}

.login-container {
  background: url('/static/images/login/bg.png') no-repeat;
  background-size: 100% 100%;
  height: 100vh;
  .box {
    position: absolute;
    width: 1002px;
    height: 500px;
    left: 50%;
    top: 50%;
    margin-left: -500px;
    margin-top: -250px;
    font-size: 16px;
    background: #ffff;
    color: #515151;
    border-radius: 10px;
    display: flex;
    padding: 20px;
    .img-box {
      flex: 1;
      > img {
        width: 480px;
        height: 400px;
      }
      .phone-box {
        margin-top: 20px;
        font-size: 16px;
        line-height: 32px;
        span {
          vertical-align: middle;
          &.icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background: url('/static/images/login/hotline.png') no-repeat;
            background-size: 100% 100%;
          }
          &.txt {
            margin-left: 5px;
          }
          &.num {
            font-size: 20px;
          }
        }
      }
    }
  }
}
</style>
