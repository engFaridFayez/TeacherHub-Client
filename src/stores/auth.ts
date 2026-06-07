import { AuthService } from "@/services/auth.service";
import type { AuthState } from "@/types/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
    state: (): AuthState => ({
        user: null,
        selectedUser: null,
        access: localStorage.getItem("access"),
        refresh: localStorage.getItem("refresh"),
        users: [],
        stages: [],
        loading: false,
        error: null,
        selectedStage: null
    }),

    getters: {
        isAuthenticated: (state) => {
            return !!state.access;
        },
    },

    actions: {

        async login(username: string, password: string) {
            try {
                const response = await AuthService.login(username, password);
                this.access = response.data.access;
                this.refresh = response.data.refresh;

                localStorage.setItem("access", this.access!);
                localStorage.setItem("refresh", this.refresh!);

                await this.fetchUser();
            } catch (error) {
                console.error("Login failed", error);
                throw error;
            }
        },
        async initializeAuth() {
            if (this.access) {
                try {
                    await this.fetchUser();
                } catch (error) {
                    this.logout();
                }
            }
        },
        async fetchUser() {
            this.loading = true;
            try {
                const response = await AuthService.me();
                this.user = response.data;
                console.log(response.data);
            } catch (error: any) {
                console.error("Fetch user failed", error)

                if (error.response?.status === 401) {
                    window.dispatchEvent(new Event("unauthorized"))
                }
            } finally {
                this.loading = false;
            }
        },
        async logout() {
            this.user = null;
            this.access = null;
            this.refresh = null;
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        },
    }
})