import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/login.vue'
import Home from '@/views/home.vue'
import Users from '@/views/users.vue'
import Rights from '@/views/rights.vue'
import Roles from '@/views/roles.vue'



Vue.use(Router)

const router = new Router({
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
        {
          name: 'users',
          path: '/users',
          component: Users

        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights

        },
        {
          name: 'roles',
          path: '/roles',
          component: Roles

        }
      ]
    }

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

