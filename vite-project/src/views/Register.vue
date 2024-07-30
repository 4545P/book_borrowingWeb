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
            <input type="submit" value="submit" class="submit" />
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
        const login = async (event) => {
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
                console.log(response.data.message);
                if (response.data.message === "註冊成功") {
                    alert("註冊成功 跳轉首頁");
                    router.push("/home");
                } else {
                    alert("欄位為空");
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
<style lang="scss">
*,
*::after,
*::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
.body {
    display: flex;
    width: 100%;
    height: 100vh;
    align-items: center;
    justify-content: center;
    background-color: #999;
}
.login {
    background-color: #777;
    width: 400px;
    color: wheat;
    padding: 40px;
    box-shadow: 10px 10px 25px #000;
}
input {
    display: block;
    margin: 20px auto;
    text-align: center;
    background: none;
    padding: 12px;
    font-size: 15px;
    border-radius: 20px;
    outline: none;
    color: aliceblue;
}
.text,
.password {
    border: 2px solid #3498db;
    width: 220px;
}
.text:focus,
.password:focus {
    border-color: #2ecc71;
    width: 280px;
    transition: 0.5s;
}
.checkbox {
    margin: 0 0;
}
.submit {
    width: 150px;
    border: 2px solid #2ecc71;
    cursor: pointer;
}
.submit:hover {
    background-color: #2ecc71;
    transition: 0.5s;
}
</style>
