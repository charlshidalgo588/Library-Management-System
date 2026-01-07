import { createRouter, createWebHistory } from 'vue-router'

// Import your views (pages)
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import AboutView from '@/views/AboutView.vue'
import DashboardView from '@/views/DashboardView.vue'
import NotFound from '@/views/NotFound.vue' // 404 page
import ProfileView from '@/views/ProfileView.vue'
import BookView from '@/views/BookView.vue'
import Borrow from '@/views/BorrowView.vue'
import HistoryView from '@/views/HistoryView.vue'

// ✅ Define all routes
const routes = [
  { path: '/', name: 'login', component: LoginView },
  { path: '/home', name: 'home', component: HomeView },
  { path: '/about', name: 'about', component: AboutView },
  { path: '/dashboard', name: 'dashboard', component: DashboardView },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound }, // Catch-all 404
  { path: '/profile', name: 'Profile', component: ProfileView },
  { path: '/', redirect: '/home' }, // Redirect root to /home
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/books', name: 'Books', component: BookView },
  { path: '/borrow', name: 'Borrow', component: Borrow },
  { path: '/history', name: 'history', component: HistoryView },
]

// ✅ Create and export router instance
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
