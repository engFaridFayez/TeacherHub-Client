<script setup lang="ts">
import { ref, onMounted } from "vue"

const classes = [
    { id: 1, name: "الصف الأول الإعدادي", description: "مناهج تأسيسية قوية", students: 120 },
    { id: 2, name: "الصف الثاني الإعدادي", description: "تطوير المهارات", students: 98 },
    { id: 3, name: "الصف الثالث الإعدادي", description: "الاستعداد للامتحانات", students: 110 },
    { id: 4, name: "الصف الأول الثانوي", description: "رحلة جديدة", students: 220 },
    { id: 5, name: "الصف الثاني الثانوي", description: "الفكر والاستعداد", students: 150 },
    { id: 6, name: "الصف الثالث الثانوي", description: "الشهادة", students: 320 },
]

const visible = ref(false)
const sectionRef = ref<HTMLElement | null>(null)

onMounted(() => {
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry?.isIntersecting) {
                visible.value = true
                observer.disconnect()
            }
        },
        { threshold: 0.15 }
    )
    if (sectionRef.value) observer.observe(sectionRef.value)
})
</script>

<template>
    <div ref="sectionRef" class="px-6 py-10">

        <div class="flex justify-center text-center mb-10">
            <h1 class="text-4xl font-bold text-slate-800 dark:text-white">
                الصفوف الدراسية
            </h1>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
            <div v-for="(cls, index) in classes" :key="cls.id"
                class="card bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 cursor-pointer border border-slate-200 dark:border-slate-700"
                :class="{ show: visible }" :style="{ '--i': index }">
                <div
                    class="icon-wrap w-14 h-14 flex items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900 text-cyan-600 mb-4">
                    📘
                </div>

                <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">
                    {{ cls.name }}
                </h2>

                <p class="text-sm text-slate-500 dark:text-slate-300">
                    {{ cls.description }}
                </p>

                <div class="mt-4 flex justify-between items-center">
                    <span class="text-xs text-slate-400">
                        عدد الطلاب: {{ cls.students }}
                    </span>
                    <button
                        class="text-sm px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition-colors duration-200">
                        عرض
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
/* ─── Entrance animation ─── */
.card {
    opacity: 0;
    transform: translateY(40px);
    /* Only animate entrance properties — NOT transform/shadow together,
       so hover doesn't fight the in-progress entrance */
    transition:
        opacity 0.55s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
    transition-delay: calc(var(--i) * 90ms);
    will-change: transform, opacity;
}

.card.show {
    opacity: 1;
    transform: translateY(0);
}

/* ─── Hover — separate layer so it never clashes with entrance ─── */
.card.show:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.1);
    /* Short, snappy hover feels lighter than a slow one */
    transition:
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.25s ease;
}

.icon-wrap {
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.card.show:hover .icon-wrap {
    transform: scale(1.12);
}
</style>