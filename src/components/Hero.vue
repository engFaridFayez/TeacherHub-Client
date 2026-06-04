<script lang="ts" setup>
import hero from "@/assets/images/hero.png"
import CarouselBackgroundVideo from "./miniComponents/CarouselBackgroundVideo.vue";
</script>

<template>
    <div
        class="relative bg-white dark:bg-white flex flex-col lg:flex-row lg:items-center justify-between px-6 md:px-12 py-12 md:py-16 overflow-hidden min-h-[90vh]">

        <!-- Background -->
        <div class="absolute inset-0 z-0 max-h-[90vh]">
            <CarouselBackgroundVideo />
        </div>

        <!-- Overlay -->
        <div class="absolute inset-0 z-10 bg-black/40 dark:bg-black/55"></div>

        <!-- Image -->
        <img class="relative z-20 image w-70 md:w-100 lg:w-auto lg:h-112.5 object-cover mb-8 lg:mb-0"
            :src="hero" alt="Teacher Hero" />

        <!-- Text -->
        <div class="relative z-20 max-w-xl text-center lg:text-right">


            <h1 class="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white leading-relaxed lalezar-regular">
                المشكلة مش إنك ضعيف في الماث
            </h1>

            <p class="mt-4 md:mt-6 text-lg md:text-2xl text-gray-100 leading-loose">
                المشكلة إن محدش شرحهولك
                <span class="text-amber-400 font-bold">
                    بالطريقة الصح
                </span>
            </p>

            <p class="text-amber-400 font-semibold mb-4 text-sm md:text-base mt-5">
                مع مستر / محمد فوزي
            </p>

            <p class="mt-6 text-base md:text-lg text-gray-300">
                شرح مبسط، متابعة مستمرة، وتدريب عملي يساعدك تحقق أعلى الدرجات بثقة.
            </p>

            <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
                <button class="bg-blue-500 cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-blue-400 transition">
                    احجز مكانك الآن
                </button>

                <button
                    class="border border-white/70 cursor-pointer text-white px-8 py-3 rounded-lg hover:bg-white/10 transition">
                    ابدأ أول درس مجانًا
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
@keyframes SlideUp {
    from {
        opacity: 0;
        transform: translateY(500px);
    }

    to {
        opacity: 1;
        transform: translateY(0px);
    }
}

.image {
    animation-name: SlideUp;
    animation-duration: 2s;
    animation-timing-function: ease-in-out;
}

.lalezar-regular {
    font-family: "Lalezar", sans-serif;
    font-weight: 400;
    font-style: normal;
}
</style>