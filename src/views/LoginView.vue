<script setup lang="ts">
import { ref } from "vue";
import { useRouter,useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute()
const username = ref("");
const password = ref("");

const loading = ref(false);
const error = ref("");

const handleLogin = async () => {
    loading.value = true;
    error.value = "";

    try {
        await authStore.login(
            username.value,
            password.value
        );

        const redirect = route.query.redirect;

        if(typeof redirect === "string" && redirect.startsWith("/") && !redirect.startsWith("//")) {
            await router.replace(redirect)
        }else {
            await router.replace({name: "home"})
        }
    } catch (err: any) {
        error.value =
            err.response?.data?.detail ||
            "اسم المستخدم أو كلمة المرور غير صحيحة";
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="max-w-md mx-auto p-6">
        <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
                <label>اسم المستخدم</label>
                <input
                    v-model="username"
                    type="text"
                    class="w-full border rounded p-2"
                />
            </div>

            <div>
                <label>كلمة المرور</label>
                <input
                    v-model="password"
                    type="password"
                    class="w-full border rounded p-2"
                />
            </div>

            <p v-if="error" class="text-red-500">
                {{ error }}
            </p>

            <button
                type="submit"
                :disabled="loading"
                class="w-full bg-blue-600 text-white p-2 rounded"
            >
                {{ loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول" }}
            </button>
        </form>
    </div>
</template>