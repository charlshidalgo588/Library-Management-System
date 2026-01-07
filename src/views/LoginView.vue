<template>
  <div class="flex w-full h-screen overflow-hidden bg-gray-50">
    <!-- Left Panel -->
    <div
      class="flex-1 relative flex flex-col justify-center items-center text-white rounded-r-[80px] overflow-hidden"
    >
      <!-- Background Image -->
      <img
        src="@/assets/backg-top.jpg"
        alt="CSU Campus"
        class="absolute inset-0 w-full h-full object-cover opacity-20"
      />

      <!-- Green Gradient Transparent Overlay -->
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(0deg, rgba(40, 96, 40, 1), rgba(7, 208, 7, 0.85));
          mix-blend-mode: multiply;
        "
      ></div>

      <!-- Content -->
      <div class="relative z-10 text-center px-10">
        <img src="@/assets/logo.png" alt="CSU Logo" class="w-48 mx-auto mb-6" />
        <h1 class="text-4xl font-bold mb-2">Hello, Welcome!</h1>
        <p class="text-xl leading-relaxed">
          Caraga State University<br />
          Library Management System
        </p>
      </div>
    </div>

    <!-- Right Panel -->
    <div class="flex-1 flex justify-center items-center">
      <el-card
        class="w-[400px] shadow-lg rounded-xl p-8 border border-gray-200 bg-white/90 backdrop-blur-md"
      >
        <h2 class="text-3xl font-bold text-center mb-6 text-gray-800">Login</h2>

        <!-- Username -->
        <el-input v-model="username" placeholder="Username" :prefix-icon="User" class="mb-4" />

        <!-- Password -->
        <el-input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          :prefix-icon="Lock"
          class="mb-4"
        >
          <template #suffix>
            <el-icon class="cursor-pointer" @click="togglePassword" :size="20">
              <component :is="showPassword ? Hide : View" />
            </el-icon>
          </template>
        </el-input>

        <!-- Remember / Forgot -->
        <div class="flex items-center justify-between text-sm mb-4">
          <label class="flex items-center text-gray-700">
            <input type="checkbox" v-model="remember" class="mr-2" />
            Remember User
          </label>
          <a href="#" class="text-green-600 hover:underline">Forgot Password?</a>
        </div>

        <!-- Login Button -->
        <el-button type="success" class="w-full" @click="login"> Login </el-button>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { User, Lock, View, Hide } from '@element-plus/icons-vue'

const username = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const router = useRouter()

function togglePassword() {
  showPassword.value = !showPassword.value
}

function login() {
  if (username.value && password.value) {
    console.log('✅ Login clicked', username.value, password.value, remember.value)
    router.push('/home')
  } else {
    alert('Please enter username and password.')
  }
}
</script>

<style scoped>
/* A soft gradient that matches CSU green branding */
.bg-green-900 {
  background: linear-gradient(135deg, #07d007, #286028);
}
</style>
