import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  // 登陆页面
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true // 当设置 true 的时候该路由不会在侧边栏出现。如401，login等页面，或者如一些编辑页面/edit/1
  },
  // 404页面
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 路由重定向到首页
  {
    path: '/',
    redirect: '/UserManage/index', // 路由的重定向，目的是登陆成功后就进入首页
    hidden: true
  },

  // 首页
  {
    path: '/UserManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'UserManage',
        component: () => import('@/views/UserManage/index'),
        meta: {
          title: '首页',
          icon: 'example'
        }
      }
    ]
  },

  // 参数配置页面
  {
    path: '/SystemSetup',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'SystemSetup',
        component: () => import('@/views/SystemSetup/index'),
        meta: {
          title: '参数配置',
          icon: 'tree-table'
        }
      }
    ]
  },

  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index-time',
    meta: {
      title: '运动测试',
      icon: 'eye-open'
    },
    children: [
      // 时间测试界面
      {
        path: 'index-time',
        name: 'index-time',
        component: () => import('@/views/dashboard/index-time'),
        meta: {
          title: '时间模式',
          icon: 'list'
        }
      },
      // 组次测试界面
      {
        path: 'index-number',
        name: 'index-number',
        component: () => import('@/views/dashboard/index-number'),
        meta: {
          title: '组次模式',
          icon: 'dashboard'
        }
      }
    ]
  },

  // 记录数据页面
  {
    path: '/DataManage',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'DataManage',
        component: () => import('@/views/DataManage/index'),
        meta: {
          title: '记录管理',
          icon: 'form'
        }
      }
    ]
  },

  // 视频教程页面
  {
    path: '/trainCourse',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'trainCourse',
        component: () => import('@/views/trainCourse/index'),
        meta: {
          title: '视频教程',
          icon: 'tree-table'
        }
      }
    ]
  },

  // 开发者页面
  {
    path: '/configure',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'configure',
        component: () => import('@/views/configure/index'),
        meta: {
          title: '开发者页',
          icon: 'tree-table'
        }
      }
    ]
  },

  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
