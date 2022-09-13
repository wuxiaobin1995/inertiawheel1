<!--
 * @Author: your name
 * @Date: 2020-02-27 10:11:47
 * @LastEditTime: 2020-03-05 15:57:21
 * @LastEditors: Please set LastEditors
 * @Description: 登录页面
 * @FilePath: \inertiawheel1\src\renderer\views\login\index.vue
 -->
<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <h3 class="title">卧式离心训练系统 V1</h3>
      <!-- 用户名输入框 -->
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          placeholder="用户名"
          @focus="ShowUserKeyboard"
        />
        <!-- 虚拟键盘 -->
        <vue-touch-keyboard
          :options="options"
          v-if="UserInputVisible"
          :layout="layout"
          :cancel="HideUserInput"
          :accept="AcceptUserInput"
          :input="input"
          class="KeyBoardStyle"
        />
      </el-form-item>
      <!-- 密码输入框 -->
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          placeholder="任意输入即可"
          @focus="ShowPasswordKeyboard"
        ></el-input>
        <!-- 虚拟键盘 -->
        <vue-touch-keyboard
          :options="options"
          v-if="PasswordInputvisible"
          :layout="layout"
          :cancel="HidePasswordInput"
          :accept="AcceptPasswordInput"
          :input="input"
          class="KeyBoardStyle"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item>
        <el-button
          type="primary"
          style="width:100%;height:50px;font-size:20px;"
          :loading="loading"
          @click.native.prevent="handleLogin"
          >登录</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'

export default {
  name: 'login',

  data() {
    // 验证用户名规则
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    // 验证密码规则
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      options: {
        useKbEvents: false,
        preventClickEvent: false
      },
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      input: null,
      layout: 'normal',
      loading: false,
      pwdType: 'password',
      UserInputVisible: false,
      PasswordInputvisible: false
    }
  },

  mounted() {
    this.handleLogin() // 马上跳转至首页
  },

  methods: {
    AcceptUserInput(text) {
      this.loginForm.username = text
      this.HideUserInput()
    },
    AcceptPasswordInput(text) {
      this.HidePasswordInput()
    },
    ShowUserKeyboard(e) {
      this.HidePasswordInput()
      this.input = e.target
      if (!this.UserInputVisible) this.UserInputVisible = true
    },
    ShowPasswordKeyboard(e) {
      this.HideUserInput()
      this.input = e.target
      if (!this.PasswordInputvisible) this.PasswordInputvisible = true
    },
    HideUserInput() {
      this.UserInputVisible = false
    },
    HidePasswordInput() {
      this.PasswordInputvisible = false
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    /* 登录按钮 */
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 50px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  display: none; // 隐藏
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 50px auto;
    .KeyBoardStyle {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;

      z-index: 1000;
      width: 80%;
      margin: 0 auto;

      padding: 1em;

      background-color: #eee;
      box-shadow: 0px -3px 10px rgba(black, 0.3);

      border-radius: 10px;
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
