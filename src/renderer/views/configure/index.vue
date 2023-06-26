<!--
 * @Author      : 吴晓斌
 * @CreateData  : 2020-06-28 11:17:51
 * @LastEditTime: 2023-06-26 11:54:19
 * @Description : 开发者页
-->
<template>
  <div class="container">
    <h1>开发者页，用于开发人员调试</h1>

    <div>
      <el-button type="primary" @click="openDev">打开控制台</el-button>
    </div>

    <!-- 免责声明 -->
    <div class="disclaimer">
      <el-input class="item" placeholder="请输入终端用户名称" v-model="name">
        <template slot="prepend"
          >终端用户名称：</template
        >
      </el-input>
      <el-input class="item" placeholder="请输入设备编号" v-model="deviceId">
        <template slot="prepend"
          >设备编号：</template
        >
      </el-input>
      <el-button class="item" type="primary" @click="handleSetDisclaimer"
        >确 定</el-button
      >
    </div>
  </div>
</template>

<script>
/* 用于打开控制台 */
import { remote } from 'electron'

export default {
  name: 'configure',

  data() {
    return {
      name: '',
      deviceId: ''
    }
  },

  created() {
    this.$prompt('请输入密码', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^htpm$/,
      inputPlaceholder: 'Please enter password',
      inputErrorMessage: '密码不正确'
    })
      .then(({}) => {})
      .catch(() => {
        this.$router.push({
          path: '/'
        })
      })

    this.name = window.localStorage.getItem('disclaimer_name')
    this.deviceId = window.localStorage.getItem('disclaimer_device_id')
  },

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
    },

    /**
     * @description: 设置免责声明
     */
    handleSetDisclaimer() {
      window.localStorage.setItem('disclaimer_name', this.name)
      window.localStorage.setItem('disclaimer_device_id', this.deviceId)

      this.$message({
        type: 'success',
        message: `设置免责声明成功！`,
        duration: 3000
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background: #eeeeee;
  padding: 10px 10px;

  .disclaimer {
    width: 50%;
    margin-top: 50px;
    border: 2px solid rgb(133, 130, 130);
    border-radius: 20px;
    padding: 20px 20px 0 20px;
    .item {
      margin-bottom: 30px;
    }
  }
}
</style>
