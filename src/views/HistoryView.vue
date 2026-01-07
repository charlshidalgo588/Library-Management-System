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

    <!-- Main content -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- Header -->
      <header
        class="relative h-[120px] flex items-center justify-between p-12 overflow-hidden z-10"
      >
        <img
          src="@/assets/backg-top.jpg"
          alt="CSU Library"
          class="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#07D007]/90 to-[#286028]/90 z-0"></div>

        <!-- Header content -->
        <div class="relative z-20 flex justify-between items-center w-full">
          <!-- Search -->
          <div class="flex items-center bg-white rounded-full px-4 py-2 w-2/3 shadow-sm">
            <el-icon class="text-gray-400"><Search /></el-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search your history..."
              class="ml-2 w-full focus:outline-none text-gray-700"
            />
          </div>

          <!-- Notifications + Profile -->
          <div class="flex items-center space-x-3 text-white">
            <!-- Notifications -->
            <div class="relative" ref="bellWrapper" @click="toggleNotifications">
              <el-icon class="text-2xl cursor-pointer hover:text-gray-200"><Bell /></el-icon>

              <!-- Red unread count -->
              <span
                v-if="unreadCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center"
              >
                {{ unreadCount }}
              </span>

              <!-- Dropdown -->
              <teleport to="body">
                <transition name="fade">
                  <div
                    v-if="showNotifications"
                    ref="notificationsDropdown"
                    class="fixed right-12 top-[100px] w-80 bg-white rounded-lg shadow-xl z-[9999] border border-gray-200"
                  >
                    <!-- Header Tabs -->
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

                    <!-- Notification Items -->
                    <div class="max-h-80 overflow-y-auto">
                      <div
                        v-for="(notif, index) in filteredNotifications"
                        :key="index"
                        class="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer transition"
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

            <!-- Profile -->
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

      <!-- Borrowed History Table -->
      <main class="flex-1 bg-gray-50 p-10 overflow-y-auto">
        <section class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-3xl font-bold mb-6 text-gray-800">Borrowed History</h2>

          <div class="flex space-x-3 mb-4">
            <el-button type="primary" @click="bulkBorrow" :disabled="!selectedRows.length">
              Borrow Selected
            </el-button>

            <el-button type="danger" @click="bulkDelete" :disabled="!selectedRows.length">
              Delete Selected
            </el-button>
          </div>

          <el-table
            :data="filteredHistory"
            stripe
            border
            class="w-full"
            @selection-change="handleSelectionChange"
          >
            <!-- NEW: selection checkbox column -->
            <el-table-column type="selection" width="55" />

            <el-table-column label="Books">
              <template #default="{ row }">
                <div class="flex items-center space-x-4">
                  <img :src="row.image" alt="Book" class="w-16 h-20 rounded shadow-sm" />
                  <div>
                    <p class="font-semibold text-gray-800">{{ row.title }}</p>
                    <p class="text-xs italic text-gray-500">by {{ row.author }}</p>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="category" label="Category" width="160" />
            <el-table-column prop="dateBorrowed" label="Date Borrowed" width="200" />
            <el-table-column prop="dateReturned" label="Date Returned" width="200" />

            <el-table-column label="Action" width="180">
              <template #default="{ row }">
                <div class="flex space-x-4">
                  <button class="text-blue-600" @click="borrowAgain(row)">Borrow again</button>
                  <button class="text-red-600" @click="deleteHistory(row)">Delete</button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { House, Collection, Document, Notebook, Search, Bell } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

/* Selected rows */
const selectedRows = ref([])

function handleSelectionChange(val) {
  selectedRows.value = val
}

/* BULK BORROW */
function bulkBorrow() {
  if (!selectedRows.value.length) return

  // Convert selected rows into borrow items
  const borrowList = selectedRows.value.map((row) => ({
    title: row.title,
    author: row.author,
    category: row.category,
    cover: row.image,
    code: row.code ?? 'Unknown',
    quantity: 1,
  }))

  // Save as ARRAY instead of one item
  sessionStorage.setItem('bulkBorrow', JSON.stringify(borrowList))

  ElMessage.success(`Added ${borrowList.length} books to borrow list`)
  router.push('/borrow')
}

/* BULK DELETE */
function bulkDelete() {
  history.value = history.value.filter((h) => !selectedRows.value.includes(h))

  localStorage.setItem('history', JSON.stringify(history.value))

  ElMessage.error(`Deleted ${selectedRows.value.length} history items`)

  selectedRows.value = []
}

/* Search */
const searchQuery = ref('')

/* History Data */
const history = ref([])

onMounted(() => {
  const saved = JSON.parse(localStorage.getItem('history') || '[]')
  history.value = saved
})

const filteredHistory = computed(() =>
  history.value.filter((h) => h.title.toLowerCase().includes(searchQuery.value.toLowerCase())),
)

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
/* History Actions */
function borrowAgain(row) {
  // Save selected book for borrow page
  sessionStorage.setItem(
    'selectedBook',
    JSON.stringify({
      title: row.title,
      author: row.author,
      category: row.category,
      code: row.code ?? 'Unknown',
      cover: row.image,
    }),
  )

  ElMessage.success(`Added "${row.title}" to borrowing list.`)

  // Redirect to borrow page
  router.push('/borrow')
}

function deleteHistory(row) {
  history.value = history.value.filter((h) => h !== row)

  // 🔥 Save updated history to localStorage
  localStorage.setItem('history', JSON.stringify(history.value))

  ElMessage.error(`Deleted history for "${row.title}"`)
}
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
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
