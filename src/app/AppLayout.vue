<template>
  <!-- flex-row عشان في RTL الـ Sidebar يروح يمين -->
  <div class="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors overflow-hidden">

    <!-- Sidebar (Right side in RTL) -->
    <Sidebar class="hidden md:flex shrink-0 w-64" />

    <!-- Main Content Area (Left side in RTL) -->
    <div class="flex-1 flex flex-col min-w-0">

      <!-- Navbar -->
      <Navbar />

      <!-- Dynamic Page Content -->
      <main class="flex-1 overflow-y-auto p-4 md:p-8">
        <RouterView />
      </main>

    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import Sidebar from './Sidebar.vue';
import Navbar from './Navbar.vue';
</script>
