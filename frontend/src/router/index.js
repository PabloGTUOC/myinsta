import { createRouter, createWebHistory } from 'vue-router'
import { useSessionStore } from '../store/session'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import PostDetailView from '../views/PostDetailView.vue'
import PostFormView from '../views/PostFormView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/post/form/:id?', name: 'post-form', component: PostFormView, meta: { requiresAuth: true } },
    { path: '/post/:id', name: 'post-detail', component: PostDetailView, meta: { requiresAuth: true } },
    { path: '/profile/:username', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior() {
    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const session = useSessionStore()
  if (to.meta.requiresAuth && !session.isAuthenticated) {
    return { name: 'login' }
  }
  if (to.name === 'login' && session.isAuthenticated) {
    const username = session.user?.username
    return username ? { name: 'profile', params: { username } } : { name: 'home' }
  }
  return true
})

export default router
