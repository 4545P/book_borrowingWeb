import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
    state: () => ({
        userId: "",
        name: "",
        phone: "",
    }),
    actions: {
        setUser(userInfo) {
            this.userId = userInfo.userId;
            this.name = userInfo.name;
            this.phone = userInfo.phone;
        },
        login(userInfo) {
            this.setUser(userInfo);
        },
        clearUser() {
            this.userId = null;
            this.name = null;
            this.phone = null;
        },
    },
});
