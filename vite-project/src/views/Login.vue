<template>
    <div class="body">
        <form @submit="login" class="login">
            <input
                type="text"
                placeholder="name"
                class="text"
                v-model="name"
            />
            <input
                type="password"
                placeholder="password"
                class="password"
                v-model="password"
            />
            <input type="submit" value="登入" class="submit" />
            <a href="/register" class="btn">
                註冊
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
        const password = ref("");
        const router = useRouter();
        const login = async (event: { preventDefault: () => void; }) => {
            event.preventDefault();
            try {
                const { useUserStore } = await import("@store/index");
                const userStore = useUserStore();
                const response = await axios.post(
                    "http://localhost:8080/api/user/isValid",
                    {
                        name: name.value,
                        password: password.value,
                    }
                );
                const { message } = response.data;
                if (response.status === 200) {
                    const userInfo = {
                        userId: response.data.userId,
                        name: response.data.name,
                        phone: response.data.phone,
                    };
                    if (response.data.message === "成功") {
                        userStore.login(userInfo);
                        router.push("/home");
                    } else {
                        alert(`登入失敗: ${message}`);
                    }
                } else {
                    console.error("登入請求失敗");
                }
            } catch (error) {
                console.error("登入請求出錯", error);
            }
        };
        return {
            name,
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
::placeholder {
    color: #999;
    opacity: 1;
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
.btn {
    margin: 20px auto;
    display: block;
    position: relative;
    z-index: 1;
    width: 150px;
    background: #777;
    border: 2px solid #2ecc71;
    border-radius: 20em;
    color: aliceblue;
    text-transform: uppercase;
    text-align: center;
    text-decoration: none;
    overflow: hidden;
    transition: 0.5s;
    padding: 10px 20px;
}
.btn span {
    position: absolute;
    width: 25%;
    height: 100%;
    background-color: #2ecc71;
    transform: translateY(150%);
    border-radius: 20em;
    left: calc((var(--n) - 1) * 25%);
    transition: 0.5s;
    transition-delay: calc((var(--n) - 1) * 0.1s);
    z-index: -1;
}
.btn:hover,
.btn:focus {
    color: aliceblue;
}
.btn:hover span {
    transform: translateY(0) scale(2);
}
.btn span:nth-child(1) {
    --n: 1;
}
.btn span:nth-child(2) {
    --n: 2;
}
.btn span:nth-child(3) {
    --n: 3;
}
.btn span:nth-child(4) {
    --n: 4;
}
</style>
