<template>
  <div v-if="authStore.isAuthenticated" class="flex flex-col h-screen bg-slate-100 font-sans overflow-hidden">
    <Navbar class="w-full shrink-0 z-20" />
    <div class="flex flex-1 overflow-hidden relative">
      <main class="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
        <RouterView />
      </main>
      <Sidebar class="hidden md:flex shrink-0 w-72 z-10 shadow-sm" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();
</script>
