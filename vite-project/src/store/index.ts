import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        userId: "",
        name: "",
        phone: "",
    }),
    persist: true,
    actions: {
        setUser(userInfo: { userId: string; name: string; phone: string; }) {
            this.userId = userInfo.userId;
            this.name = userInfo.name;
            this.phone = userInfo.phone;
        },
        login(userInfo: { userId: string; name: string; phone: string; }) {
            this.setUser(userInfo);
        },
        clearUser() {
            this.userId = "";
            this.name = "";
            this.phone = "";
        },
    },
});
