<!--
 * @Author: your name
 * @Date: 2020-02-27 10:11:47
 * @LastEditTime: 2023-06-26 11:54:39
 * @LastEditors : Please set LastEditors
 * @Description: 首页
 * @FilePath: \inertiawheel1\src\renderer\views\UserManage\index.vue
 -->
<template>
  <div class="app-container">
    <div class="wrapper">
      <!-- Logo -->
      <img class="img" src="@/assets/logo.png" />
      <!-- 标题 -->
      <div class="text">台式离心飞轮训练系统 v1.0.0</div>
      <!-- 免责声明 -->
      <div :style="{ margin: '50px 0 0 0 ' }">
        <el-button type="danger" round @click="dialogVisible = true"
          >用 户 告 知</el-button
        >
      </div>
      <el-dialog
        title="用户告知"
        :visible.sync="dialogVisible"
        width="40%"
        center
      >
        <div>
          终端用户名称：<span :style="{ color: 'red' }">{{ name }}</span>
        </div>
        <div>
          设备编号：<span :style="{ color: 'red' }">{{ deviceId }}</span>
        </div>
        <div>
          <h3>为了避免纠纷，特做如下说明：</h3>
          <p>
            1、请用户核对上面的"终端用户名称"，若该名称和你目前的名称不相符，请及时联系厂家（电话：0750-6318728）
          </p>
          <p>
            2、若长时间未告知厂家，而后续出现问题需要厂家提供服务时，则合同上的一切承诺的售后服务等将失效！
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false"
            >已 阅</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManage',

  data() {
    return {
      /* 免责声明 */
      dialogVisible: false,
      name: window.localStorage.getItem('disclaimer_name'),
      deviceId: window.localStorage.getItem('disclaimer_device_id')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;

  .wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 100px;

    /* Logo */
    .img {
      width: 70%;
    }
    /* 标题 */
    .text {
      margin-top: 40px;
      font-size: 60px;
    }
  }
}
</style>
