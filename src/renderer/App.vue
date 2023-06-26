<!--
 * @Author: your name
 * @Date: 2020-02-18 09:35:06
 * @LastEditTime: 2023-06-26 11:43:37
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
    this.initLocalStorage()
  },

  methods: {
    /**
     * @description: 软件启动后，初始化localStorage的一些值
     */
    initLocalStorage() {
      /* 初始化localStorage中的向心离心之比 */
      if (!window.localStorage.getItem('setPercent')) {
        window.localStorage.setItem('setPercent', '1.1')
      }
      /* 初始化免责声明的终端用户名称 */
      if (!window.localStorage.getItem('disclaimer_name')) {
        window.localStorage.setItem('disclaimer_name', '')
      }
      /* 初始化免责声明的设备编号 */
      if (!window.localStorage.getItem('disclaimer_device_id')) {
        window.localStorage.setItem('disclaimer_device_id', '')
      }
    }
  }
}
</script>

<style lang="scss">
@import './styles/index.scss'; // 全局自定义的css样式
</style>
