<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <form
      @submit.prevent="handleSubmit"
      class="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6"
    >
      <h2 class="text-3xl font-bold text-center text-gray-800">Welcome Back</h2>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700" for="email">
          Email
        </label>
        <input
          v-model="email"
          id="email"
          type="email"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div class="space-y-1">
        <label class="block text-sm font-medium text-gray-700" for="password">
          Password
        </label>
        <input
          v-model="password"
          id="password"
          type="password"
          class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <button
        type="submit"
        class="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Login
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuth } from "~/composables/useAuth";

const email = ref("homework@eva.guru");
const password = ref("Homeworkeva1**");

const { login } = useAuth();

const handleSubmit = async () => {
  await login(email.value, password.value);
};
</script>
