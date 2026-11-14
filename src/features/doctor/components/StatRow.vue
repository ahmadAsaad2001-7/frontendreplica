<template>
  <div class="flex justify-between items-center">
    <span class="text-slate-400 text-xs">{{ label }}</span>
    <span class="font-bold text-slate-100">{{ value }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number }>();
</script>
