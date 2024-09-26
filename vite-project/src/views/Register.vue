<template>
    <div class="body">
        <form @submit="login" class="login">
            <input type="text" placeholder="name" class="text" v-model="name" />
            <input
                type="text"
                placeholder="phone"
                class="text"
                v-model="phone"
            />
            <input
                type="password"
                placeholder="password"
                class="password"
                v-model="password"
            />
            <input type="submit" value="送出" class="submit" />
            <input type="reset" value="清空" class="submit" />
            <a href="/login" class="btn">
                返回
                <span></span><span></span><span></span><span></span>
            </a>
        </form>
    </div>
</template>

<script lang="ts">
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
    setup() {
        const name = ref("");
        const phone = ref("");
        const password = ref("");
        const router = useRouter();
        const login = async (event: { preventDefault: () => void; }) => {
            event.preventDefault();
            try {
                await import("@store/index");
                const response = await axios.post(
                    "http://localhost:8080/api/user/add",
                    {
                        name: name.value,
                        phone: phone.value,
                        password: password.value,
                    }
                );
                const { message } = response.data;
                if (response.data.message === "成功") {
                    alert("註冊成功 跳轉首頁");
                    router.push("/home");
                } else {
                    alert(`註冊失敗: ${message}`);
                }
            } catch (error) {
                alert("註冊請求出錯");
                console.error("註冊請求出錯", error);
            }
        };
        return {
            name,
            phone,
            password,
            login,
            router,
        };
    },
};
</script>
