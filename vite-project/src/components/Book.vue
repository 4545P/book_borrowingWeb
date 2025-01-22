<template lang="">
    <El-dialog v-model="submitBookForm" title="新增書籍" width="70%">
        <El-input
            v-model="form.isbn"
            placeholder="書號"
            prop="isbn"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.name"
            placeholder="書名"
            prop="name"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.author"
            placeholder="作者"
            prop="author"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-input
            v-model="form.introduction"
            placeholder="簡介"
            prop="introduction"
            style="display: flex; margin: 0 auto; padding: 8px; width: 70%"
        />
        <El-form-item>
            <El-button
                type="primary"
                native-type="submit"
                style="display: flex; margin: 0 80%"
                @click="bookForm"
                >提交</El-button
            >
        </El-form-item>
    </El-dialog>
</template>
<script lang="ts">
import { ref } from "vue";
import axios from "axios";

export default {
    props: {
        visible: Boolean,
    },
    setup(props, { emit }) {
        const visibleRef = ref(props.visible);
        const form = ref({
            isbn: "",
            name: "",
            author: "",
            introduction: "",
        });
        const submitBookForm = () => {
            emit("update:visible", false);
            emit("submit", form.value);
            emit("close");
        };
        const bookForm = () => {
            axios
                .post("http://localhost:8080/api/book/add", form.value)
                .then((response) => {
                    console.log("API Response:", response);
                    alert(response.data.message);
                })
                .catch((error) => {
                    console.error("API Error:", error);
                    alert("新增失敗");
                });
                window.location.reload();
        };
        return {
            visibleRef,
            form,
            submitBookForm,
            bookForm,
        };
    },
};
</script>
