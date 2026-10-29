import api from "./api";
import type {Stage} from "@/types/stage";


export const StageService = {
    getStages() {
        return api.get<Stage[]>("stages/")
    }
}