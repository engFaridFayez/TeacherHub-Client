import api from "./api";

export const AuthService = {
    login(username:string,password:string) {
        return api.post('token/',{username,password});
    },

    me() {
        return api.get("me/");
    },
}