<!--
 * @Author: your name
 * @Date: 2020-02-18 09:35:06
 * @LastEditTime: 2020-09-14 14:22:18
 * @LastEditors : Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \inertiawheel1\src\renderer\App.vue
 -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',

  created() {
    /* 初始化localStorage中的向心离心之比 */
    if (!window.localStorage.getItem('setPercent')) {
      window.localStorage.setItem('setPercent', '1.1')
    }
  }
}
</script>

<style lang="scss">
@import './styles/index.scss'; // 全局自定义的css样式
</style>
