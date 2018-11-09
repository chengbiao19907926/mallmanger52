

// const  VueRouter from 'vue-router'

const  Login = () => import ('@/views/login.vue')
const  Home = () => import ('@/views/home.vue')
const  Users = () => import('@/views/users.vue')
const  Rights = () => import ('@/views/rights.vue')
const  Roles = () => import ('@/views/roles.vue')
const  Cateparams = () => import ('@/views/cateparams.vue')
const  Goodscate = () => import ('@/views/goodscate.vue')
const  Goodslist = () => import ('@/views/goodslist.vue')
const  Goodsadd = () => import ('@/views/goodsadd.vue')
const  Order = () => import ('@/views/order.vue')
const  Reports = () => import ('@/views/reports.vue')



Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        { name: 'users',path: '/users',component: Users},
        { name: 'rights',path: '/rights',component: Rights},
        { name: 'roles',path: '/roles',component: Roles},
        { name: 'cateparams',path: '/params',component: Cateparams},
        { name: 'goodscate',path: '/categories',component: Goodscate},
        { name: 'goodslist',path: '/goods',component: Goodslist},
        { name: 'goodsadd',path: '/goodsadd',component: Goodsadd},
        { name: 'order',path: '/orders',component: Order},
        { name: 'reports',path: '/reports',component: Reports}
      ]}
    ]
})
router.beforeEach((to, from, next) => {
  console.log(to, from)
  if (to.path === '/login') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }
    next()

  }


})

// 导航守卫
export default router

