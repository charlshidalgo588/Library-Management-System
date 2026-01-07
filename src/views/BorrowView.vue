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
        Caraga State University <br />
        Library Management System
      </h2>

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

    <!-- Main Content -->
    <div class="flex-1 flex flex-col bg-white">
      <!-- Header -->
      <header
        class="relative h-[120px] flex items-center justify-between p-12 overflow-hidden z-10"
      >
        <img
          src="@/assets/backg-top.jpg"
          class="absolute inset-0 w-full h-full object-cover object-center z-0"
        />
        <div class="absolute inset-0 bg-gradient-to-r from-[#07D007]/90 to-[#286028]/90 z-0"></div>

        <div class="relative z-20 flex justify-between items-center w-full">
          <!-- Search bar -->
          <div class="flex items-center bg-white rounded-full px-4 py-2 w-2/3 shadow-sm">
            <el-icon class="text-gray-400"><Search /></el-icon>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search borrowed books..."
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
              <img src="@/assets/justin.png" class="w-10 h-10 rounded-full border-2 border-white" />
              <span class="font-medium">Justin Nabunturan</span>
            </router-link>
          </div>
        </div>
      </header>

      <!-- Borrow Page -->
      <main class="flex-1 p-10 grid grid-cols-2 gap-10 bg-gray-50 overflow-y-auto">
        <!-- Borrow List -->
        <section>
          <h2 class="text-2xl font-semibold text-green-700 mb-6">Borrowing</h2>

          <el-input
            v-model="bookId"
            placeholder="Scan or enter Book ID"
            clearable
            class="w-full mb-6"
          >
            <template #prefix>
              <el-icon class="text-gray-400"><Search /></el-icon>
            </template>

            <template #suffix>
              <el-icon
                class="cursor-pointer text-green-600 hover:text-green-800"
                @click="openScanner"
              >
                <Camera />
              </el-icon>
            </template>
          </el-input>

          <div
            v-for="(book, index) in borrowedBooks"
            :key="index"
            class="bg-white rounded-lg shadow-sm flex items-center justify-between p-4 mb-4 border hover:shadow-md"
          >
            <div class="flex gap-4 items-center">
              <img :src="book.image" class="w-16 h-20 rounded shadow-sm" />
              <div>
                <p class="text-sm font-semibold">Book code: {{ book.code }}</p>
                <p class="text-sm">Book name: {{ book.name }}</p>
                <p class="text-xs text-gray-500">Category: {{ book.category }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <el-button
                type="default"
                :icon="Minus"
                size="small"
                circle
                @click="decreaseQty(book)"
              />
              <span>{{ book.qty }}</span>
              <el-button
                type="default"
                :icon="Plus"
                size="small"
                circle
                @click="increaseQty(book)"
              />
              <el-button
                type="danger"
                :icon="Close"
                size="small"
                circle
                @click="removeBook(index)"
              />
            </div>
          </div>
        </section>

        <!-- Student Info -->
        <section class="bg-white border rounded-lg shadow-md p-8">
          <h2 class="text-2xl font-semibold text-green-700 mb-6">Student Information</h2>

          <el-form :model="student" label-position="top">
            <el-form-item label="Date Borrowed">
              <el-date-picker v-model="student.dateBorrowed" type="datetime" class="w-full" />
            </el-form-item>

            <el-form-item label="Expected Return Date">
              <el-date-picker v-model="student.returnDate" type="date" class="w-full" />
            </el-form-item>

            <el-form-item label="Student ID">
              <el-input v-model="student.id" />
            </el-form-item>

            <el-form-item label="Contact Number">
              <el-input v-model="student.contact" />
            </el-form-item>

            <el-form-item label="Address">
              <el-input v-model="student.address" />
            </el-form-item>

            <!-- Student Display -->
            <div class="flex items-center mt-6 mb-6">
              <img src="@/assets/justin.png" class="w-16 h-16 rounded-full border mr-4" />
              <div>
                <p class="font-semibold">Justin Nabunturan</p>
                <p class="text-sm text-gray-500">BSIS - 3</p>
              </div>
            </div>

            <!-- Terms -->
            <div class="border-t pt-6">
              <p class="text-gray-700 text-justify mb-4">
                “I have read and understood the
                <span class="font-semibold">Terms and Conditions</span> of the CSU Library.”
              </p>

              <div class="flex flex-col items-center space-y-1">
                <el-checkbox v-model="agreeTerms" size="large">
                  <span class="text-green-600 font-semibold">Terms and Condition</span>
                </el-checkbox>

                <a href="#" @click.prevent="openTermsDialog" class="text-green-500 text-sm">
                  click here
                </a>
              </div>
            </div>

            <div class="flex justify-end gap-4 mt-8">
              <el-button type="danger" plain>Cancel</el-button>
              <el-button type="success" @click="validateBeforeConfirm">Confirm</el-button>
            </div>
          </el-form>
        </section>
      </main>
    </div>

    <!-- Terms Modal -->
    <el-dialog v-model="showTermsDialog" title="Library Terms and Conditions" width="600px">
      <!-- Scrollable Container -->
      <div class="text-sm text-gray-700 leading-relaxed max-h-[350px] overflow-y-auto pr-3">
        <p class="mb-3">
          By borrowing materials from the CSU Library, you acknowledge and agree to the following
          rules and responsibilities:
        </p>

        <ul class="list-disc pl-6 space-y-2">
          <li>
            <strong>Return books on time.</strong> All borrowed materials must be returned on or
            before the assigned due date to ensure availability for other students.
          </li>

          <li>
            <strong>No fines are charged for late returns.</strong> However, overdue books may
            result in temporary suspension of borrowing privileges.
          </li>

          <li>
            <strong>Clearance may be blocked for overdue or unreturned books.</strong>
            Students will not be allowed to process their academic or graduation clearance until all
            library obligations are settled.
          </li>

          <li>
            <strong>You are responsible for the care of borrowed materials.</strong> Books must be
            returned in the same condition as when borrowed.
          </li>

          <li>
            <strong>Lost or damaged books must be replaced.</strong> Replacement must be the same
            title and edition, or a librarian-approved equivalent if the original is unavailable.
          </li>

          <li>
            <strong>Renewals must be requested before the due date.</strong> Renewal approval is
            subject to book availability and library rules.
          </li>

          <li>
            <strong>Borrowing is a privilege.</strong> The library may suspend your borrowing rights
            for repeated violations of library policies or misuse of materials.
          </li>

          <li>
            <strong>Books must not be lent to others.</strong> You are fully responsible for all
            items borrowed under your name and ID.
          </li>

          <li>
            <strong>All library obligations must be cleared each semester.</strong> This includes
            returning all borrowed books and settling any pending replacement requirements.
          </li>

          <li>
            <strong>Graduating students must clear with the library before graduation.</strong>
            Unreturned or damaged items will delay clearance processing.
          </li>
        </ul>
      </div>

      <template #footer>
        <el-button @click="showTermsDialog = false">Close</el-button>
        <el-button type="success" @click="agreeToTerms">I Agree</el-button>
      </template>
    </el-dialog>

    <!-- Borrow Confirm -->
    <el-dialog
      v-model="showBorrowConfirm"
      width="500px"
      align-center
      :show-close="false"
      custom-class="borrow-confirm-dialog"
    >
      <div class="text-center py-6">
        <div
          class="mx-auto w-20 h-20 flex items-center justify-center rounded-full border-4 border-gray-400 text-gray-600 mb-4"
        >
          <el-icon size="50"><QuestionFilled /></el-icon>
        </div>

        <p class="text-gray-700 text-base leading-relaxed px-6">
          You're borrowing from the <strong>CSU Library</strong>. Click <strong>Confirm</strong> to
          continue!
        </p>
      </div>

      <template #footer>
        <div class="grid grid-cols-2">
          <button
            class="py-3 text-white bg-red-600 hover:bg-red-700 transition font-semibold uppercase"
            @click="showBorrowConfirm = false"
          >
            Cancel
          </button>

          <button
            class="py-3 text-white bg-green-600 hover:bg-green-700 transition font-semibold uppercase"
            @click="finalizeBorrow"
          >
            Confirm
          </button>
        </div>
      </template>
    </el-dialog>

    <!-- Borrow Slip -->
    <el-dialog
      v-model="showBorrowSlip"
      width="450px"
      title="Caraga State University Library - Borrow Slip"
    >
      <div class="text-sm text-gray-700 leading-relaxed">
        <p><strong>Receipt #:</strong> {{ borrowSlip.receiptNo }}</p>
        <p><strong>Date:</strong> {{ borrowSlip.date }}</p>
        <p><strong>Student ID:</strong> {{ borrowSlip.studentId }}</p>
        <p><strong>Borrow ID:</strong> {{ borrowSlip.borrowId }}</p>

        <hr class="my-3" />

        <div v-for="(book, i) in borrowSlip.books" :key="i">
          <p>
            {{ book.name }} x{{ book.qty }} <span class="italic">({{ book.category }})</span>
          </p>
        </div>

        <hr class="my-3" />

        <div class="flex flex-col items-center mt-4">
          <img :src="qrCodeUrl" class="w-40 h-40" />
          <p class="text-xs text-gray-500 mt-2">
            Present this QR code to the librarian to claim your book.
          </p>
        </div>
      </div>

      <template #footer>
        <el-button type="success" @click="showBorrowSlip = false">Done</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import QRCode from 'qrcode'
import {
  House,
  Collection,
  Document,
  Notebook,
  Search,
  Plus,
  Minus,
  Close,
  Camera,
  QuestionFilled,
  Bell,
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

function saveToHistory() {
  const existing = JSON.parse(localStorage.getItem('history') || '[]')

  borrowedBooks.value.forEach((book) => {
    existing.push({
      title: book.name,
      author: book.author ?? 'Unknown Author',
      category: book.category,
      dateBorrowed: new Date().toLocaleString(),
      dateReturned: 'Not yet returned',
      image: book.image,
    })
  })

  localStorage.setItem('history', JSON.stringify(existing))
}

/* ===========================
      NOTIFICATIONS
=========================== */
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

const bellWrapper = ref(null)
const notificationsDropdown = ref(null)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
}

function markAsRead(notif) {
  notif.read = true
}

const filteredNotifications = computed(() => {
  return tab.value === 'unread' ? notifications.value.filter((n) => !n.read) : notifications.value
})

function handleClickOutside(event) {
  if (
    bellWrapper.value?.contains(event.target) ||
    notificationsDropdown.value?.contains(event.target)
  ) {
    return
  }
  showNotifications.value = false
}

onMounted(() => window.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => window.removeEventListener('click', handleClickOutside))

/* ===========================
      BORROW LOGIC
=========================== */
const searchQuery = ref('')
const bookId = ref('')

// Borrowed books (start empty, rely ONLY on Books.vue)
const borrowedBooks = ref([])

/* Add selectedBook if coming from Books page */
onMounted(() => {
  /* --- 1) If coming from single-book borrow --- */
  const single = sessionStorage.getItem('selectedBook')
  if (single) {
    const book = JSON.parse(single)
    borrowedBooks.value.push({
      code: book.code ?? 'Unknown',
      name: book.title,
      category: book.category ?? 'Unknown',
      image: book.cover,
      qty: 1,
    })
    sessionStorage.removeItem('selectedBook')
  }

  /* --- 2) If coming from BULK BORROW --- */
  const bulk = sessionStorage.getItem('bulkBorrow')
  if (bulk) {
    const list = JSON.parse(bulk)

    list.forEach((book) => {
      borrowedBooks.value.push({
        code: book.code ?? 'Unknown',
        name: book.title,
        author: book.author ?? 'Unknown Author',
        category: book.category ?? 'Unknown',
        image: book.cover,
        qty: 1,
      })
    })

    sessionStorage.removeItem('bulkBorrow')
  }
})

//* VALIDATION — User must fill all fields before confirming */
const student = ref({
  dateBorrowed: new Date(),
  returnDate: '',
  id: '2025-0001',
  contact: '09999999999',
  address: 'Ampayon, Butuan City',
})

const isFormValid = computed(() => {
  return (
    student.value.dateBorrowed &&
    student.value.returnDate &&
    student.value.id.trim() !== '' &&
    student.value.contact.trim() !== '' &&
    student.value.address.trim() !== '' &&
    borrowedBooks.value.length > 0 &&
    agreeTerms.value === true
  )
})

function validateBeforeConfirm() {
  if (!student.value.dateBorrowed) {
    ElMessage.error('Please select the date borrowed.')
    return
  }

  if (!student.value.returnDate) {
    ElMessage.error('Please select the expected return date.')
    return
  }

  if (student.value.id.trim() === '') {
    ElMessage.error('Student ID is required.')
    return
  }

  if (student.value.contact.trim() === '') {
    ElMessage.error('Contact number is required.')
    return
  }

  if (student.value.address.trim() === '') {
    ElMessage.error('Address is required.')
    return
  }

  if (borrowedBooks.value.length === 0) {
    ElMessage.error('You must borrow at least one book.')
    return
  }

  if (!agreeTerms.value) {
    ElMessage.error('You must agree to the Terms and Conditions.')
    return
  }

  // If all good → proceed
  confirmBorrow()
}

/* TERMS */
const agreeTerms = ref(false)
const showTermsDialog = ref(false)

function openTermsDialog() {
  showTermsDialog.value = true
}

function agreeToTerms() {
  agreeTerms.value = true
  showTermsDialog.value = false
}

/* ACTIONS */
function increaseQty(book) {
  book.qty++
}
function decreaseQty(book) {
  if (book.qty > 1) book.qty--
}
function removeBook(i) {
  borrowedBooks.value.splice(i, 1)
}

/* CONFIRMATION + SLIP */
const showBorrowConfirm = ref(false)
const showBorrowSlip = ref(false)
const qrCodeUrl = ref('')
const borrowSlip = ref({})

function confirmBorrow() {
  showBorrowConfirm.value = true
}

async function finalizeBorrow() {
  showBorrowConfirm.value = false

  const receiptNo = 'REC-' + Math.floor(Math.random() * 9000 + 1000)
  const borrowId = 'BRW-' + Math.random().toString(36).substring(2, 8).toUpperCase()

  borrowSlip.value = {
    receiptNo,
    borrowId,
    date: new Date().toLocaleString(),
    studentId: student.value.id,
    books: borrowedBooks.value,
  }

  const qrText = `Receipt: ${receiptNo}
Borrow ID: ${borrowId}
Student: ${student.value.id}`

  qrCodeUrl.value = await QRCode.toDataURL(qrText)

  showBorrowSlip.value = true
  ElMessage.success('Borrow confirmed!')

  // 🔵 Save to history
  saveToHistory()
}

function openScanner() {
  ElMessage.info('Scanner feature coming soon!')
}
</script>

<style scoped>
aside {
  background: linear-gradient(180deg, #07d007, #286028);
}
.nav-link {
  @apply flex items-center gap-3 px-4 py-2 rounded-md hover:bg-green-600 transition;
}

/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Confirm Dialog */
.borrow-confirm-dialog .el-dialog__header {
  display: none;
}
.borrow-confirm-dialog .el-dialog__body {
  padding: 0;
}
.borrow-confirm-dialog .el-dialog__footer {
  padding: 0;
  border-top: 1px solid #ddd;
}
</style>
