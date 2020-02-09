/**
 * @Description :墨抒颖
 * @Author :墨抒颖
 * @Date :2019-12-19 14:23:33
 * @LastEditTime :2020-02-09 22:56:15
 * @LastEditors :墨抒颖
 * @Github :https://github.com/moshuying
 * @Gitee :https://gitee.com/moshuying
 * @Blogs :https://blog.csdn.net/qq_34846662
 */
import Vue from 'vue'
import Router from 'vue-router'
const File = require(/* webpackChunkName: 'ImportFuncDemo' */ './_import_' +
  process.env.NODE_ENV +
  '.js')
Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: File('login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: File('404'),
    hidden: true
  },
  {
    path: '/',
    redirect: '/swipe/index'
  },
  {
    path: '/swipe',
    component: Layout,
    redirect: '/swipe/index',
    children: [
      { path: 'index', component: () => import('@/views/page/swiper.vue'), meta: { title: '轮播图管理', icon: 'dashboard' }}
    ]
  },
  {
    path: '/teachers',
    component: Layout,
    redirect: '/teachers/index',
    children: [
      { path: 'index', component: () => import('@/views/page/teachers.vue'), meta: { title: '师资管理', icon: 'dashboard' }}
    ]
  },
  {
    path: '/cases',
    component: Layout,
    redirect: '/cases/index',
    children: [
      { path: 'index', component: () => import('@/views/page/cases.vue'), meta: { title: '案例管理', icon: 'dashboard' }}
    ]
  },
  {
    path: '/school',
    component: Layout,
    redirect: '/school/index',
    children: [
      { path: 'index', component: () => import('@/views/page/school.vue'), meta: { title: '院校管理', icon: 'dashboard' }}
    ]
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/index',
    children: [
      { path: 'index', component: () => import('@/views/page/news.vue'), meta: { title: '资讯管理', icon: 'dashboard' }}
    ]
  },
  {
    path: '/leaveWord',
    component: Layout,
    redirect: '/leaveWord/index',
    children: [
      { path: 'index', component: () => import('@/views/page/leaveWord.vue'), meta: { title: '留言管理', icon: 'dashboard' }}
    ]
  },
  {
    path: '/courses',
    component: Layout,
    redirect: '/courses/index',
    children: [
      { path: 'index', component: () => import('@/views/page/courses.vue'), meta: { title: '课程管理', icon: 'dashboard' }}
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
