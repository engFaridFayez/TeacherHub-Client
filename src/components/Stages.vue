<script setup lang="ts">
import { useStageStore } from "@/stores/stage";
import { ref, onMounted, onUnmounted, nextTick } from "vue";

const stageStore = useStageStore();

const sectionRef = ref<HTMLElement | null>(null);

let observer: IntersectionObserver | null = null;

onMounted(async () => {
  await stageStore.getAll();
  await nextTick();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer?.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  sectionRef.value
    ?.querySelectorAll(".card")
    .forEach((card) => observer?.observe(card));
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div ref="sectionRef" class="px-6 py-10">
    <div class="flex justify-center text-center mb-10">
      <h1 class="text-4xl font-bold text-slate-800 dark:text-white">
        الصفوف الدراسية
      </h1>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
      <div
        v-for="(stage, index) in stageStore.stages"
        :key="stage.id"
        :style="{ '--i': index }"
        class="card bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 cursor-pointer border border-slate-200 dark:border-slate-700"
      >
        <div
          class="icon-wrap w-14 h-14 flex items-center justify-center rounded-xl bg-cyan-100 dark:bg-cyan-900 text-cyan-600 mb-4"
        >
          📘
        </div>

        <h2 class="text-xl font-bold text-slate-800 dark:text-white mb-2">
          {{ stage.name }}
        </h2>

        <p class="text-sm text-slate-500 dark:text-slate-300">
          {{ stage.description }}
        </p>

        <div class="mt-4 flex justify-between items-center">
          <button
            class="text-sm px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition-colors duration-200"
          >
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
