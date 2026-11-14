import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface AppNotification {
    id: string;
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    type: 'info' | 'success' | 'warning' | 'prescription';
}

export const useNotificationStore = defineStore('notification', () => {
    // بيانات تجريبية للإشعارات
    const notifications = ref<AppNotification[]>([
        {
            id: 'n1',
            title: 'تذكير بموعد',
            message: 'لديك موعد غداً مع د. طارق الحكيم الساعة 04:00 م.',
            time: 'قبل 10 دقائق',
            isRead: false,
            type: 'warning'
        },
        {
            id: 'n2',
            title: 'تم تأكيد الحجز',
            message: 'تم تأكيد حجزك مع د. منى عبد الرحمن بنجاح.',
            time: 'أمس',
            isRead: true,
            type: 'success'
        }
    ]);

    // عداد الإشعارات غير المقروءة
    const unreadCount = computed(() => notifications.value.filter(n => !n.isRead).length);

    // إضافة إشعار جديد
    function addNotification(notif: Omit<AppNotification, 'id' | 'time' | 'isRead'>) {
        notifications.value.unshift({
            ...notif,
            id: `notif_${Date.now()}`,
                                    time: 'الآن',
                                    isRead: false
        });
    }

    // تعليم إشعار كمقروء
    function markAsRead(id: string) {
        const notif = notifications.value.find(n => n.id === id);
        if (notif) notif.isRead = true;
    }

    // تعليم الكل كمقروء
    function markAllAsRead() {
        notifications.value.forEach(n => n.isRead = true);
    }

    return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead
    };
});
