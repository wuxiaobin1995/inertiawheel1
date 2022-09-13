<!--
 * @Author      : 吴晓斌
 * @CreateData  : 2020-06-28 11:17:51
 * @LastEditTime: 2020-12-26 16:35:39
 * @Description : 开发者页
-->
<template>
  <div class="container">
    <h1>开发者页，用于开发人员调试</h1>

    <div><el-button type="primary" @click="openDev">打开控制台</el-button></div>
  </div>
</template>

<script>
/* 用于打开控制台 */
import { remote } from 'electron'

export default {
  name: 'configure',

  methods: {
    /* 打开控制台 */
    openDev() {
      this.$prompt('请输入密码', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^htpm$/,
        inputPlaceholder: 'Please enter password',
        inputErrorMessage: '密码不正确'
      })
        .then(({ value }) => {
          try {
            remote.getCurrentWebContents().openDevTools()
          } catch (err) {
            this.$message({
              type: 'error',
              message: '打开控制台失败!'
            })
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #eeeeee;
  padding: 10px 10px;
}
</style>
