<template>
  <div class="p-10 text-center bg-white rounded shadow">
    <h1 class="text-3xl font-bold text-blue-600 mb-4">📊 Dashboard</h1>

    <p class="text-gray-700 mb-6">
      This is your dashboard page. Here you can manage app data or display stats.
    </p>

    <!-- ✅ Element Plus Example -->
    <el-card class="mx-auto mb-6" style="width: 300px">
      <h3 class="text-lg font-semibold mb-2">Quick Action</h3>
      <el-button type="success" round @click="sayHello">Say Hello</el-button>
    </el-card>

    <!-- 🧮 Pinia Counter (Store) -->
    <div class="mt-10 bg-gray-50 p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4 text-indigo-600">Pinia Store Counter</h2>
      <p class="text-lg mb-4">Count: {{ counter.count }}</p>
      <el-button type="primary" @click="counter.increment">Add</el-button>
    </div>

    <!-- 🧩 Composable Counter -->
    <div class="mt-10 bg-gray-100 p-6 rounded-lg shadow">
      <h2 class="text-2xl font-bold mb-4 text-green-600">Composable Counter</h2>
      <p class="text-lg mb-4">Count: {{ count }}</p>
      <el-button type="primary" round @click="increment">Add</el-button>
      <el-button type="danger" round @click="decrement">Subtract</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { useCounter } from '@/composables/useCounter'

const counter = useCounterStore() // Pinia store
const { count, increment, decrement } = useCounter() // Composable logic

function sayHello() {
  alert('👋 Hello from Dashboard!')
}

// ✅ Log your environment variable (check in console)
console.log('API URL:', import.meta.env.VITE_API_URL)
</script>
