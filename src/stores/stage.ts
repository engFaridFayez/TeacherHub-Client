
import { StageService } from "@/services/stage.service";
import type { Stage } from "@/types/stage";
import { defineStore } from "pinia";



export const useStageStore = defineStore("stage", {
    state: () => ({
        loading: false as boolean,
        error: null as string | null,
        stages: [] as Stage[]
    }),


    actions: {
        async getAll() {
            this.loading = true
            this.error = null

            try {
                const response = await StageService.getStages()
                this.stages = response.data;
            } catch (error) {
                this.error = "error catching stages"
            } finally {
                this.loading = false;
            }

        }
    }
})