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

      <nav class="mt-8 w-full px-4">
        <ul class="space-y-2">
          <li>
            <router-link to="/home" class="nav-link" active-class="bg-green-800">
              <el-icon><House /></el-icon> Home
            </router-link>
          </li>
          <li>
            <router-link to="/books" class="nav-link" active-class="bg-green-800">
              <el-icon><Collection /></el-icon> Books
            </router-link>
          </li>
          <li>
            <router-link to="/borrow" class="nav-link" active-class="bg-green-800">
              <el-icon><Document /></el-icon> Borrow
            </router-link>
          </li>
          <li>
            <router-link to="/history" class="nav-link" active-class="bg-green-800">
              <el-icon><Notebook /></el-icon> History
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- ================= MAIN CONTENT ================= -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- ================= HEADER ================= -->
      <header
        class="relative h-[120px] flex items-center justify-between p-12 overflow-hidden z-10"
      >
        <img
          src="@/assets/backg-top.jpg"
          class="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#07D007]/90 to-[#286028]/90"></div>

        <!-- Wrapper -->
        <div class="relative z-10 flex justify-between items-center w-full">
          <!-- Search bar -->
          <div class="flex items-center bg-white rounded-full px-4 py-2 w-2/3 shadow-sm">
            <el-icon class="text-gray-400"><Search /></el-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for books..."
              class="ml-2 w-full focus:outline-none text-gray-700"
            />
          </div>

          <!-- Notifications + Profile -->
          <div class="flex items-center space-x-3 text-white">
            <!-- Notifications -->
            <div class="relative" ref="bellWrapper" @click="toggleNotifications">
              <el-icon class="text-2xl cursor-pointer text-white hover:text-gray-200 transition">
                <Bell />
              </el-icon>

              <!-- Red unread dot -->
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
              >
                {{ unreadCount }}
              </span>

              <!-- Teleport dropdown with Fade Transition -->
              <teleport to="body">
                <transition name="fade">
                  <div
                    v-if="showNotifications"
                    ref="notificationsDropdown"
                    class="fixed right-12 top-[100px] w-80 bg-white rounded-lg shadow-xl z-[9999] border border-gray-200"
                  >
                    <!-- Header Tabs -->
                    <div class="flex justify-between items-center px-4 py-3 border-b">
                      <h3 class="font-semibold text-gray-700">Notification</h3>
                      <div class="flex space-x-2 text-sm font-medium">
                        <button
                          class="px-2 py-1 rounded-md"
                          :class="
                            tab === 'all'
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:text-blue-600'
                          "
                          @click.stop="tab = 'all'"
                        >
                          All
                        </button>
                        <button
                          class="px-2 py-1 rounded-md"
                          :class="
                            tab === 'unread'
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:text-blue-600'
                          "
                          @click.stop="tab = 'unread'"
                        >
                          Unread
                        </button>
                      </div>
                    </div>

                    <!-- Notifications List -->
                    <div class="max-h-80 overflow-y-auto">
                      <div
                        v-for="(notif, index) in filteredNotifications"
                        :key="index"
                        class="px-4 py-3 border-b cursor-pointer hover:bg-gray-50 transition"
                        @click.stop="markAsRead(notif)"
                      >
                        <p class="text-sm font-semibold text-gray-800">{{ notif.title }}</p>
                        <p class="text-xs text-gray-600 mt-1">{{ notif.message }}</p>
                        <div class="flex justify-between items-center mt-1">
                          <span class="text-[11px] text-gray-400">{{ notif.date }}</span>
                          <span
                            v-if="!notif.read"
                            class="inline-block w-2 h-2 bg-blue-500 rounded-full"
                          ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </transition>
              </teleport>
            </div>

            <!-- ➤ Profile -->
            <router-link
              to="/profile"
              class="flex items-center space-x-2 hover:opacity-90 transition text-white"
            >
              <img src="@/assets/justin.png" class="w-10 h-10 rounded-full border-2 border-white" />
              <span class="font-medium">Justin Nabunturan</span>
            </router-link>
          </div>
        </div>
      </header>

      <!-- ================= BOOK LIST ================= -->
      <main class="flex-1 p-6 overflow-y-auto bg-gray-50">
        <!-- Filters -->
        <div class="flex justify-between items-center mb-4">
          <div class="flex items-center bg-white rounded-lg px-3 py-2 w-1/3 shadow-sm">
            <el-icon class="text-gray-400"><Search /></el-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search for books..."
              class="ml-2 w-full focus:outline-none text-gray-700"
            />
          </div>

          <div class="flex items-center space-x-2">
            <select v-model="category" class="border border-gray-300 rounded-md p-2 text-sm">
              <option>All Categories</option>
              <option>Saved Books</option>
              <option>Science</option>
              <option>Mathematics</option>
              <option>History</option>
            </select>
          </div>
        </div>

        <!-- GRID OF BOOKS -->
        <section class="mb-10">
          <h2 class="text-2xl font-bold mb-4">
            {{ category === 'All Categories' ? 'All Books' : category }}
          </h2>

          <div class="grid grid-cols-4 gap-6">
            <div
              v-for="(book, i) in filteredBooks"
              :key="i"
              class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer"
              @click="openBookDetails(book)"
            >
              <img :src="book.cover" class="w-full h-60 object-cover" />

              <div class="p-4">
                <h3 class="font-semibold text-sm mb-1">{{ book.title }}</h3>
                <p class="text-xs text-gray-600 mb-2 italic">by {{ book.author }}</p>

                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span>Available: {{ book.available }}</span>

                  <div class="flex gap-3 items-center">
                    <!-- FAVORITE ICON -->
                    <el-icon
                      style="font-size: 22px; cursor: pointer"
                      :class="
                        isFavorite(book) ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-500'
                      "
                      @click.stop="toggleFavorite(book)"
                    >
                      <CollectionTag />
                    </el-icon>

                    <!-- Borrow Icon -->
                    <el-icon
                      style="font-size: 22px; cursor: pointer"
                      class="text-green-600 hover:text-green-800"
                      @click.stop="openBookDetails(book)"
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

    <!-- 📘 RIGHT SIDE BOOK DETAILS PANEL -->
    <transition name="slide-panel">
      <div
        v-if="selectedBook"
        class="fixed top-0 right-0 w-[40%] h-full bg-white shadow-2xl z-[9999] p-6 overflow-y-auto"
      >
        <button class="absolute top-4 right-4 text-3xl" @click="closePanel">×</button>

        <img :src="selectedBook.cover" class="w-full h-[380px] object-cover rounded-lg mb-4" />

        <h2 class="text-xl font-bold mb-2">{{ selectedBook.title }}</h2>
        <p class="italic text-gray-600 mb-4">by {{ selectedBook.author }}</p>

        <p class="text-gray-700 mb-6">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Book description here...
        </p>

        <div class="bg-green-100 text-green-900 px-3 py-2 rounded-md inline-block mb-6">
          Available: {{ selectedBook.available }}
        </div>

        <!-- Borrow Now -->
        <button
          @click="borrowNow"
          class="w-full bg-green-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-700 transition"
        >
          Borrow Now
        </button>
      </div>
    </transition>

    <!-- BACKDROP -->
    <transition name="fade">
      <div
        v-if="selectedBook"
        class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
        @click="closePanel"
      ></div>
    </transition>
  </div>
</template>

<script setup>
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
} from '@element-plus/icons-vue'

onMounted(() => {
  const forced = sessionStorage.getItem('forceCategory')
  if (forced) {
    category.value = forced
    sessionStorage.removeItem('forceCategory')
  }

  // Load favorites again (important!)
  const saved = localStorage.getItem('favorites')
  if (saved) favorites.value = JSON.parse(saved)
})

const router = useRouter()

const favorites = ref(JSON.parse(localStorage.getItem('favorites') || '[]'))

function toggleFavorite(book) {
  const exists = favorites.value.find((b) => b.title === book.title)

  if (exists) {
    // Remove from favorites
    favorites.value = favorites.value.filter((b) => b.title !== book.title)
    ElMessage.error(`Removed "${book.title}" from favorites`)
  } else {
    // Add to favorites
    favorites.value.push(book)
    ElMessage.success(`Added "${book.title}" to favorites`)
  }

  localStorage.setItem('favorites', JSON.stringify(favorites.value))
}

function isFavorite(book) {
  return favorites.value.some((b) => b.title === book.title)
}

/* SIDE PANEL */
const selectedBook = ref(null)
function openBookDetails(book) {
  selectedBook.value = book
}
function closePanel() {
  selectedBook.value = null
}

/* 🚀 Borrow Now */
function borrowNow() {
  sessionStorage.setItem('selectedBook', JSON.stringify(selectedBook.value))
  router.push('/borrow')
}

/* SEARCH + CATEGORIES */
const searchQuery = ref('')
const category = ref('All Categories')

const allBooks = ref([
  /* ====================== SCIENCE (10 books) ====================== */
  {
    code: 'SCI-001',
    title: 'The Eighth Day of Creation',
    author: 'Horace Freeland Judson',
    available: 21,
    cover: 'https://covers.openlibrary.org/b/id/240726-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-002',
    title: 'Darwin: The Life of a Tormented Evolutionist',
    author: 'Adrian Desmond, James Moore',
    available: 30,
    cover: 'https://covers.openlibrary.org/b/id/295689-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-003',
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    available: 15,
    cover: 'https://covers.openlibrary.org/b/id/8374981-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-004',
    title: 'The Gene: An Intimate History',
    author: 'Siddhartha Mukherjee',
    available: 12,
    cover: 'https://covers.openlibrary.org/b/id/8231850-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-005',
    title: 'Astrophysics for People in a Hurry',
    author: 'Neil deGrasse Tyson',
    available: 40,
    cover: 'https://covers.openlibrary.org/b/id/8226091-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-006',
    title: 'A Brief History of Time',
    author: 'Stephen Hawking',
    available: 18,
    cover: 'https://covers.openlibrary.org/b/id/240727-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-007',
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    available: 22,
    cover: 'https://covers.openlibrary.org/b/id/8168697-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-008',
    title: 'The Immortal Life of Henrietta Lacks',
    author: 'Rebecca Skloot',
    available: 10,
    cover: 'https://covers.openlibrary.org/b/id/7540920-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-009',
    title: 'Cosmos',
    author: 'Carl Sagan',
    available: 14,
    cover: 'https://covers.openlibrary.org/b/id/8281991-L.jpg',
    category: 'Science',
  },
  {
    code: 'SCI-010',
    title: 'The Body: A Guide for Occupants',
    author: 'Bill Bryson',
    available: 25,
    cover: 'https://covers.openlibrary.org/b/id/9870109-L.jpg',
    category: 'Science',
  },

  /* ====================== MATHEMATICS (10 books) ====================== */
  {
    code: 'MATH-001',
    title: 'Flatland: A Romance of Many Dimensions',
    author: 'Edwin A. Abbott',
    available: 22,
    cover: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-002',
    title: 'Two, Three... Infinity',
    author: 'George Gamow',
    available: 18,
    cover: 'https://covers.openlibrary.org/b/id/5548379-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-003',
    title: 'The Princeton Companion to Mathematics',
    author: 'Timothy Gowers',
    available: 11,
    cover: 'https://covers.openlibrary.org/b/id/6300093-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-004',
    title: 'Gödel, Escher, Bach',
    author: 'Douglas Hofstadter',
    available: 16,
    cover: 'https://covers.openlibrary.org/b/id/8226078-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-005',
    title: 'Introduction to Probability',
    author: 'Joseph K. Blitzstein',
    available: 20,
    cover: 'https://covers.openlibrary.org/b/id/9870115-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-006',
    title: 'Calculus',
    author: 'James Stewart',
    available: 33,
    cover: 'https://covers.openlibrary.org/b/id/9870123-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-007',
    title: 'Discrete Mathematics and Its Applications',
    author: 'Kenneth Rosen',
    available: 29,
    cover: 'https://covers.openlibrary.org/b/id/240725-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-008',
    title: 'How Not to Be Wrong: The Power of Mathematical Thinking',
    author: 'Jordan Ellenberg',
    available: 14,
    cover: 'https://covers.openlibrary.org/b/id/8691424-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-009',
    title: 'The Joy of x',
    author: 'Steven Strogatz',
    available: 26,
    cover: 'https://covers.openlibrary.org/b/id/8209256-L.jpg',
    category: 'Mathematics',
  },
  {
    code: 'MATH-010',
    title: 'Fermat’s Enigma',
    author: 'Simon Singh',
    available: 12,
    cover: 'https://covers.openlibrary.org/b/id/8319896-L.jpg',
    category: 'Mathematics',
  },

  /* ====================== HISTORY (10 books) ====================== */
  {
    code: 'HIST-001',
    title: 'History of the Ancient World',
    author: 'Susan Wise Bauer',
    available: 10,
    cover: 'https://covers.openlibrary.org/b/id/10566567-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-002',
    title: 'A Short History of Nearly Everything',
    author: 'Bill Bryson',
    available: 12,
    cover: 'https://covers.openlibrary.org/b/id/8281991-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-003',
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    available: 15,
    cover: 'https://covers.openlibrary.org/b/id/8231847-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-004',
    title: 'SPQR: A History of Ancient Rome',
    author: 'Mary Beard',
    available: 20,
    cover: 'https://covers.openlibrary.org/b/id/8204401-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-005',
    title: 'The Silk Roads',
    author: 'Peter Frankopan',
    available: 17,
    cover: 'https://covers.openlibrary.org/b/id/8215362-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-006',
    title: 'The Crusades: The Authoritative History',
    author: 'Thomas Asbridge',
    available: 19,
    cover: 'https://covers.openlibrary.org/b/id/8128820-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-007',
    title: 'Team of Rivals',
    author: 'Doris Kearns Goodwin',
    available: 13,
    cover: 'https://covers.openlibrary.org/b/id/8375637-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-008',
    title: '1776',
    author: 'David McCullough',
    available: 22,
    cover: 'https://covers.openlibrary.org/b/id/7222371-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-009',
    title: 'The Wright Brothers',
    author: 'David McCullough',
    available: 14,
    cover: 'https://covers.openlibrary.org/b/id/8211451-L.jpg',
    category: 'History',
  },
  {
    code: 'HIST-010',
    title: 'The Roman Empire: A Very Short Introduction',
    author: 'Christopher Kelly',
    available: 28,
    cover: 'https://covers.openlibrary.org/b/id/240726-L.jpg',
    category: 'History',
  },
])

const filteredBooks = computed(() => {
  // ⭐ Favorites filter
  if (category.value === 'Saved Books') {
    return favorites.value.filter((b) =>
      b.title.toLowerCase().includes(searchQuery.value.toLowerCase()),
    )
  }

  // Normal filtering
  let books = allBooks.value

  if (category.value !== 'All Categories') {
    books = books.filter((b) => b.category === category.value)
  }

  if (searchQuery.value.trim()) {
    books = books.filter((b) => b.title.toLowerCase().includes(searchQuery.value.toLowerCase()))
  }

  return books
})

/* 🔔 Notifications system */
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

const unreadCount = computed(() => notifications.value.filter((n) => !n.read).length)
const filteredNotifications = computed(() =>
  tab.value === 'unread' ? notifications.value.filter((n) => !n.read) : notifications.value,
)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}
function markAsRead(notif) {
  notif.read = true
}

/* Close when clicking OUTSIDE */
const bellWrapper = ref(null)
const notificationsDropdown = ref(null)

function handleClickOutside(event) {
  const bellEl = bellWrapper.value
  const dropdownEl = notificationsDropdown.value
  if (!bellEl && !dropdownEl) return

  const target = event.target
  if (bellEl && !bellEl.contains(target) && dropdownEl && !dropdownEl.contains(target)) {
    showNotifications.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  window.removeEventListener('click', handleClickOutside)
})

// Load saved favorites after page loads
onMounted(() => {
  const saved = localStorage.getItem('favorites')
  if (saved) {
    favorites.value = JSON.parse(saved)
  }
})
</script>

<style scoped>
aside {
  background: linear-gradient(180deg, #07d007, #286028);
}
.nav-link {
  @apply flex items-center gap-3 px-4 py-2 rounded-md hover:bg-green-600 transition;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-panel-enter-active,
.slide-panel-leave-active {
  transition: transform 0.3s ease;
}
.slide-panel-enter-from,
.slide-panel-leave-to {
  transform: translateX(100%);
}
</style>
