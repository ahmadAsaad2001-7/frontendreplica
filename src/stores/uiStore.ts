import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useUIStore = defineStore('ui', () => {
    const isDarkMode = ref(false);
    const isAccountSwitcherOpen = ref(false);
    const isAddFamilyMemberOpen = ref(false);
    const isTaskDrawerOpen = ref(false);
    const activeTaskId = ref<string | null>(null);

    // Watch and apply theme
    watch(isDarkMode, (val) => {
        if (val) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    });

        function toggleTheme() {
            isDarkMode.value = !isDarkMode.value;
        }

        function openAccountSwitcher() { isAccountSwitcherOpen.value = true; }
        function closeAccountSwitcher() { isAccountSwitcherOpen.value = false; }

        function openTaskDrawer(taskId: string) {
            activeTaskId.value = taskId;
            isTaskDrawerOpen.value = true;
        }
        function closeTaskDrawer() {
            activeTaskId.value = null;
            isTaskDrawerOpen.value = false;
        }

        return {
            isDarkMode, toggleTheme,
            isAccountSwitcherOpen, openAccountSwitcher, closeAccountSwitcher,
            isAddFamilyMemberOpen,
            isTaskDrawerOpen, activeTaskId, openTaskDrawer, closeTaskDrawer
        };
});
