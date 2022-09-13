<!--
 * @Author: your name
 * @Date: 2020-02-27 10:11:47
 * @LastEditTime: 2020-12-26 14:41:40
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
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserManage'
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
