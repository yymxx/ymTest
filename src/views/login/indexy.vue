<template>
  <div class="login-container">
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
        <div style="width: 256px;margin: 0 auto;">
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
            style="width: 260px;">登 录</el-button>
        </div>
      </el-form>
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
  height: 100%;
  position: relative;
  background: url('/static/images/bg.jpg') left center no-repeat #fff;
  background-size: 53% auto;
  .box-group {
    width: 420px;
    padding: 40px;
    position: absolute;
    top: 50%;
    right: 18%;
    margin-top: -200px;
    .title-container {
      font-size: 20px;
      font-weight: bold;
    }

    .el-form /deep/ {
      .el-form-item {
        margin-top: 32px;
        .el-form-item__content {
          height: 40px;
          .svg-container {
            position: absolute;
            left: 0;
            top: 2px;
            z-index: 10;
            width: 40px;
            font-size: 16px;
            color: #aaa;
            vertical-align: middle;
          }

          .el-input {
            font-size: 14px;
            vertical-align: middle;
            .el-input__inner {
              border: none;
              border-bottom: 1px solid #eee;
              border-radius: 0;
              padding-left: 40px;
            }
          }
        }

        .el-form-item__error {
          left: 36px;
          top: 120%;
        }
      }

      .loginBtn {
        margin-top: 36px;
        font-size: 16px;
        background: #6283f7;
        border-radius: 18px;
      }
    }
  }
}
</style>
