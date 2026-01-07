<template>
  <div class="flex h-screen w-screen bg-gray-100 overflow-hidden">
    <!-- Sidebar -->
    <aside class="w-64 bg-green-700 text-white flex flex-col items-center py-6 space-y-6">
      <router-link to="/home">
        <img
          src="@/assets/logo.png"
          alt="CSU Logo"
          class="w-48 mb-2 cursor-pointer hover:opacity-90 transition"
        />
      </router-link>
      <h2 class="text-center text-base font-semibold leading-tight">
        Caraga State University<br />
        Library Management System
      </h2>

      <!-- Navigation -->
      <nav class="mt-4 w-full px-4">
        <ul class="space-y-2">
          <li>
            <router-link
              to="/home"
              class="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-green-600 transition"
              active-class="bg-green-800"
            >
              <el-icon><House /></el-icon> Home
            </router-link>
          </li>
          <li>
            <router-link
              to="/books"
              class="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-green-600 transition"
              active-class="bg-green-800"
            >
              <el-icon><Collection /></el-icon> Books
            </router-link>
          </li>
          <li>
            <router-link
              to="/borrow"
              class="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-green-600 transition"
              active-class="bg-green-800"
            >
              <el-icon><Document /></el-icon> Borrow
            </router-link>
          </li>
          <li>
            <router-link
              to="/history"
              class="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-green-600 transition"
              active-class="bg-green-800"
            >
              <el-icon><Notebook /></el-icon> History
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- Header -->
      <header
        class="relative h-[120px] flex items-center justify-between p-12 overflow-hidden z-10"
      >
        <!-- Background image -->
        <img
          src="@/assets/backg-top.jpg"
          alt="CSU Library"
          class="absolute inset-0 w-full h-full object-cover object-center"
        />

        <!-- Green overlay -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#07D007]/90 to-[#286028]/90"></div>

        <!-- Header Content -->
        <div class="relative z-10 flex justify-between items-center w-full">
          <!-- Left: Search -->
          <div class="flex items-center bg-white rounded-full px-4 py-2 w-2/3 shadow-sm">
            <el-icon class="text-gray-400"><Search /></el-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for books..."
              class="ml-2 w-full focus:outline-none text-gray-700"
            />
          </div>

          <!-- Right: Notifications + Profile -->
          <div class="flex items-center space-x-3 text-white">
            <!-- Notifications -->
            <div ref="bellWrapper" class="relative">
              <el-icon
                class="text-2xl cursor-pointer hover:text-gray-200"
                @click.stop="toggleNotifications"
              >
                <Bell />
              </el-icon>

              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
              >
                {{ unreadCount }}
              </span>

              <teleport to="body">
                <transition name="fade">
                  <div
                    v-if="showNotifications"
                    ref="notificationsDropdown"
                    class="fixed right-12 top-[100px] w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-[99999]"
                    @click.stop
                  >
                    <div class="flex justify-between items-center px-4 py-3 border-b">
                      <h3 class="font-semibold text-gray-700">Notifications</h3>

                      <div class="flex space-x-2 text-sm font-medium">
                        <button
                          class="px-2 py-1 rounded-md"
                          :class="tab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-600'"
                          @click.stop="tab = 'all'"
                        >
                          All
                        </button>

                        <button
                          class="px-2 py-1 rounded-md"
                          :class="tab === 'unread' ? 'bg-blue-600 text-white' : 'text-gray-600'"
                          @click.stop="tab = 'unread'"
                        >
                          Unread
                        </button>
                      </div>
                    </div>

                    <div class="max-h-80 overflow-y-auto">
                      <div
                        v-for="(notif, index) in filteredNotifications"
                        :key="index"
                        class="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
                        @click.stop="markAsRead(notif)"
                      >
                        <p class="text-sm font-semibold">{{ notif.title }}</p>
                        <p class="text-xs text-gray-600 mt-1">{{ notif.message }}</p>

                        <div class="flex justify-between items-center mt-1">
                          <span class="text-[11px] text-gray-400">{{ notif.date }}</span>
                          <span v-if="!notif.read" class="w-2 h-2 bg-blue-500 rounded-full"></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </teleport>
            </div>

            <!-- User info -->
            <router-link
              to="/profile"
              class="flex items-center space-x-2 hover:opacity-90 transition"
            >
              <img
                src="@/assets/justin.png"
                alt="User"
                class="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
              />
              <span class="font-medium cursor-pointer">Justin Nabunturan</span>
            </router-link>
          </div>
        </div>
      </header>

      <!-- Main Dashboard -->
      <main class="flex-1 p-8 overflow-y-auto bg-gray-50">
        <!-- Discover Section -->
        <section class="mb-10">
          <div class="flex justify-between items-start flex-wrap gap-8">
            <div class="flex-1 min-w-[300px]">
              <h1 class="text-4xl font-bold mb-4">Discover</h1>
              <div class="bg-white p-6 rounded-lg shadow-md italic text-gray-700 leading-relaxed">
                “Perhaps we only leave So we may once again arrive, To get a bird's eye view Of what
                it means to be alive. For there is beauty in returning, Oh how wonderful, how
                strange, To see that everything is different But know it's only you who's changed
                Erin Hanson”
                <p class="text-right mt-2 font-medium">— Erin Hanson</p>
              </div>
            </div>

            <!-- 📘 RIGHT SIDE BOOK DETAILS PANEL (HOME PAGE) -->
            <transition name="slide-panel">
              <div
                v-if="selectedBookHome"
                class="fixed top-0 right-0 w-[40%] h-full bg-white shadow-2xl z-[9999] p-6 overflow-y-auto"
              >
                <button class="absolute top-4 right-4 text-3xl" @click="closeHomePanel">×</button>

                <img
                  :src="selectedBookHome.cover"
                  class="w-full h-[380px] object-cover rounded-lg mb-4"
                />

                <h2 class="text-xl font-bold mb-2">{{ selectedBookHome.title }}</h2>
                <p class="italic text-gray-600 mb-4">by {{ selectedBookHome.author }}</p>

                <p class="text-gray-700 mb-6">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Book description here...
                </p>

                <div class="bg-green-100 text-green-900 px-3 py-2 rounded-md inline-block mb-6">
                  Available: {{ selectedBookHome.available }}
                </div>

                <!-- Borrow Now -->
                <button
                  @click="borrowNowFromHome"
                  class="w-full bg-green-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition"
                >
                  Borrow Now
                </button>
              </div>
            </transition>

            <!-- BACKDROP -->
            <transition name="fade">
              <div
                v-if="selectedBookHome"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
                @click="closeHomePanel"
              ></div>
            </transition>

            <!-- Stats Cards -->
            <div
              class="grid grid-cols-2 gap-6 text-center font-semibold text-gray-800 min-w-[400px]"
            >
              <div
                class="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-green-50 cursor-pointer"
              >
                <el-icon class="text-green-600 text-4xl mb-2"><UserFilled /></el-icon>
                <p class="text-3xl font-bold text-green-700">8,738</p>
                <p>Registered Students</p>
              </div>

              <div
                class="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-green-50 cursor-pointer"
              >
                <el-icon class="text-green-600 text-4xl mb-2"><Finished /></el-icon>
                <p class="text-3xl font-bold text-green-700">5,345</p>
                <p>Books Issued</p>
              </div>

              <div
                class="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-green-50 cursor-pointer"
              >
                <el-icon class="text-green-600 text-4xl mb-2"><Reading /></el-icon>
                <p class="text-3xl font-bold text-green-700">9,738</p>
                <p>Total Books</p>
              </div>

              <div
                class="bg-white p-6 rounded-lg shadow-md transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:bg-green-50 cursor-pointer"
              >
                <el-icon class="text-green-600 text-4xl mb-2"><Collection /></el-icon>
                <p class="text-3xl font-bold text-green-700">6,564</p>
                <p>Available Books</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Recommended for You -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">Recommended for You</h2>
          <div class="grid grid-cols-4 gap-6">
            <div
              v-for="(book, i) in filteredRecommended"
              :key="i"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img :src="book.cover" :alt="book.title" class="w-full h-60 object-cover" />
              <div class="p-4">
                <h3 class="font-semibold text-sm mb-1">{{ book.title }}</h3>
                <p class="text-xs text-gray-600 mb-2 italic">by {{ book.author }}</p>
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Available: {{ book.available }}</span>
                  <div class="flex gap-3 items-center">
                    <el-icon
                      :class="
                        favorites.some((f) => f.title === book.title)
                          ? 'text-yellow-400'
                          : 'text-gray-400 hover:text-yellow-500'
                      "
                      style="font-size: 22px; cursor: pointer"
                      @click.stop="saveAndGoToSaved(book)"
                    >
                      <CollectionTag />
                    </el-icon>

                    <el-icon
                      class="text-green-600 hover:text-green-800 cursor-pointer"
                      style="font-size: 22px"
                      @click.stop="openHomePanel(book)"
                    >
                      <CirclePlus />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Top Borrowed -->
        <section>
          <h2 class="text-2xl font-bold mb-4">Top Borrowed Books</h2>
          <div class="grid grid-cols-4 gap-6">
            <div
              v-for="(book, i) in filteredTopBorrowed"
              :key="i"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <img :src="book.cover" :alt="book.title" class="w-full h-60 object-cover" />
              <div class="p-4">
                <h3 class="font-semibold text-sm mb-1">{{ book.title }}</h3>
                <p class="text-xs text-gray-600 mb-2 italic">by {{ book.author }}</p>

                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Available: {{ book.available }}</span>

                  <!-- Larger Icons -->
                  <div class="flex gap-3 items-center">
                    <el-icon
                      :class="
                        favorites.some((f) => f.title === book.title)
                          ? 'text-yellow-400'
                          : 'text-gray-400 hover:text-yellow-500'
                      "
                      style="font-size: 22px; cursor: pointer"
                      @click.stop="saveAndGoToSaved(book)"
                    >
                      <CollectionTag />
                    </el-icon>

                    <el-icon
                      class="text-green-600 hover:text-green-800 cursor-pointer"
                      style="font-size: 22px"
                      @click.stop="openHomePanel(book)"
                    >
                      <CirclePlus />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Book {
  title: string
  author?: string
  available?: number
  cover: string
  borrowed?: number
  category?: string
}

import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  House,
  Collection,
  Document,
  Notebook,
  Search,
  Bell,
  CollectionTag,
  CirclePlus,
  UserFilled,
  Finished,
  Reading,
} from '@element-plus/icons-vue'

const router = useRouter()

const favorites = ref<Book[]>(JSON.parse(localStorage.getItem('favorites') || '[]'))

const filteredRecommended = computed(() => {
  if (!searchQuery.value) return recommendedBooks.value

  return recommendedBooks.value.filter((book) =>
    (book.title + book.author + (book.code || ''))
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase()),
  )
})

const filteredTopBorrowed = computed(() => {
  if (!searchQuery.value) return topBorrowedBooks.value

  return topBorrowedBooks.value.filter((book) =>
    (book.title + book.author).toLowerCase().includes(searchQuery.value.toLowerCase()),
  )
})

// ⭐ SIDE PANEL for home
const selectedBookHome = ref<Book | null>(null)

function openHomePanel(book: Book) {
  selectedBookHome.value = book
}

function closeHomePanel() {
  selectedBookHome.value = null
}

function borrowNowFromHome() {
  sessionStorage.setItem('selectedBook', JSON.stringify(selectedBookHome.value))
  router.push('/borrow')
}

function borrowFromHome(book: Book) {
  sessionStorage.setItem('selectedBook', JSON.stringify(book))
  router.push('/borrow')
}

// ⭐ Save book + redirect to Saved Books category
function saveAndGoToSaved(book: Book) {
  const exists = favorites.value.find((b: Book) => b.title === book.title)

  if (!exists) {
    favorites.value.push(book)
    ElMessage.success(`Added "${book.title}" to Saved Books`)
  } else {
    ElMessage.info(`"${book.title}" is already saved`)
  }

  localStorage.setItem('favorites', JSON.stringify(favorites.value))

  // No redirect — stays in HomeView
}

/* ============= SEARCH ============= */
const searchQuery = ref('')

/* ============= RECOMMENDED BOOKS ============= */
const recommendedBooks = ref([
  {
    code: 'PRG-001',
    title: 'The Mythical Man-Month',
    author: 'Frederick P. Brooks Jr.',
    available: 9,
    cover: 'https://covers.openlibrary.org/b/id/240727-L.jpg',
  },
  {
    code: 'PRG-002',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt, Dave Thomas',
    available: 100,
    cover: 'https://covers.openlibrary.org/b/id/9870112-L.jpg',
  },
  {
    code: 'PRG-003',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    available: 40,
    cover: 'https://covers.openlibrary.org/b/id/5548379-L.jpg',
  },
  {
    code: 'PRG-004',
    title: 'Refactoring',
    author: 'Martin Fowler',
    available: 30,
    cover: 'https://covers.openlibrary.org/b/id/9870109-L.jpg',
  },

  // ⭐ NEW RECOMMENDED BOOKS
  {
    code: 'PRG-005',
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    available: 20,
    cover: 'https://covers.openlibrary.org/b/id/8372046-L.jpg',
  },
  {
    code: 'PRG-006',
    title: 'You Don’t Know JS Yet',
    author: 'Kyle Simpson',
    available: 55,
    cover: 'https://covers.openlibrary.org/b/id/11055680-L.jpg',
  },
  {
    code: 'PRG-007',
    title: 'The Clean Coder',
    author: 'Robert C. Martin',
    available: 35,
    cover: 'https://covers.openlibrary.org/b/id/10473943-L.jpg',
  },
  {
    code: 'PRG-008',
    title: 'Working Effectively with Legacy Code',
    author: 'Michael Feathers',
    available: 12,
    cover: 'https://covers.openlibrary.org/b/id/240726-L.jpg',
  },
])

/* ============= TOP BORROWED BOOKS ============= */
const topBorrowedBooks = ref([
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    available: 220,
    cover: 'https://covers.openlibrary.org/b/id/240725-L.jpg',
  },
  {
    title: 'Design Patterns',
    author: 'Erich Gamma',
    available: 200,
    cover: 'https://covers.openlibrary.org/b/id/8226078-L.jpg',
  },
  {
    title: 'Cracking the Coding Interview',
    author: 'Gayle Laakmann McDowell',
    available: 180,
    cover: 'https://covers.openlibrary.org/b/id/9870123-L.jpg',
  },
  {
    title: 'Head First Design Patterns',
    author: 'Eric Freeman',
    available: 150,
    cover: 'https://covers.openlibrary.org/b/id/9870115-L.jpg',
  },

  // ⭐ NEW TOP BORROWED BOOKS
  {
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    available: 140,
    cover: 'https://covers.openlibrary.org/b/id/240728-L.jpg',
  },
  {
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    available: 130,
    cover: 'https://covers.openlibrary.org/b/id/8231993-L.jpg',
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell, Peter Norvig',
    available: 120,
    cover: 'https://covers.openlibrary.org/b/id/240724-L.jpg',
  },
  {
    title: 'Programming Pearls',
    author: 'Jon Bentley',
    available: 95,
    cover: 'https://covers.openlibrary.org/b/id/5548469-L.jpg',
  },
])

/* ======================================================
      NOTIFICATIONS (MATCHED EXACTLY LIKE BORROW.VUE)
====================================================== */
const showNotifications = ref(false)
const tab = ref('all')

const notifications = ref([
  {
    title: 'READY FOR PICKUP:',
    message: '"Introduction to Algorithms" is ready. Pick up at Main Library by Oct 24, 2025',
    date: 'Oct 24, 2025',
    read: false,
  },
  {
    title: '"Computer Networks"',
    message: 'and 2 other items are due tomorrow. Renew now if you need more time.',
    date: 'Oct 23, 2025',
    read: false,
  },
  {
    title: 'SUCCESSFUL RENEWAL:',
    message: 'All 3 items renewed! New due date: November 20, 2023',
    date: 'Nov 20, 2023',
    read: false,
  },
])

const bellWrapper = ref<HTMLElement | null>(null)
const notificationsDropdown = ref<HTMLElement | null>(null)

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)

const filteredNotifications = computed(() =>
  tab.value === 'unread' ? notifications.value.filter((n) => !n.read) : notifications.value,
)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

type Notif = {
  title: string
  message: string
  date: string
  read: boolean
}

function markAsRead(notif: Notif) {
  notif.read = true
}

function clickOutside(e: MouseEvent) {
  if (
    bellWrapper.value?.contains(e.target as Node) ||
    notificationsDropdown.value?.contains(e.target as Node)
  ) {
    return
  }

  showNotifications.value = false
}

onMounted(() => {
  setTimeout(() => {
    // ensures refs EXIST before listening
    window.addEventListener('click', clickOutside)
  }, 0)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', clickOutside)
})
</script>

<style scoped>
.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s ease;
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}

aside {
  background: linear-gradient(180deg, #07d007, #286028);
}
/* Fade transition for dropdown */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
