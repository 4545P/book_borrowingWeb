<template>
    <div class="app">
        <div class="app-container" style="width: 90vw; margin: 0 auto">
            <div class="filter-container">
                <El-input
                    v-model="listQuery.name"
                    placeholder="書名"
                    style="width: 180px; height: 65px"
                    class="filter-item"
                />
                <El-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="fetchBook"
                >搜尋
                </El-button>
                <El-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="AddBook"
                >新增書籍
                </El-button>
                <El-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="logout"
                >登出
                </El-button>
            </div>
            <div class="list-container">
                <El-table
                    :data="tableData"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%"
                >
                    <El-table-column
                        label="ID"
                        prop="inventoryId"
                        align="center"
                        width="70"
                    >
                        <template #default="{ row }">
                            <span>{{ row.inventoryId }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="ISBN" prop="isbn" min-width="70px">
                        <template #default="{ row }">
                            <span class="link-type">{{ row.isbn }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="書名" prop="name" min-width="70px">
                        <template #default="{ row }">
                            <span class="link-type">{{ row.name }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="狀態" prop="status" min-width="70px">
                        <template #default="{ row }">
                            <span class="link-type">{{ row.status }}</span>
                        </template>
                    </El-table-column>
                    <El-table-column label="操作" align="center" width="750" class-name="small-padding fixed-width">
                        <template #default="{ row }">
                            <El-button type="primary" round @click="borrowingBook(row)">借書</El-button>
                            <El-button type="success" round @click="returnBook(row)">還書</El-button>
                            <El-button round @click="stock(row)">入庫</El-button>
                            <El-button type="info" round @click="lost(row)">遺失</El-button>
                            <El-button type="warning" round @click="damaged(row)">損毀</El-button>
                            <El-button type="danger" round @click="scrap(row)">銷毀</El-button>
                        </template>
                    </El-table-column>
                </El-table>
                <El-dialog title="Chart" width="70%">
                    <div class="chart-container">
                        <div id="pieChart" style="width: 100%; height: 400px"></div>
                    </div>
                    <span class="dialog-footer">
                        <El-button>離開</El-button>
                    </span>
                </El-dialog>
            </div>
            <El-dialog>
                <El-form
                    ref="dataForm"
                    :model="listQuery"
                    label-position="left"
                    label-width="70px"
                    style="width: 400px; margin-left: 50px"
            >
            </El-form>
                    <El-form-item label="Type" prop="type">
                        <El-select
                            v-model="listQuery.type"
                            class="filter-item"
                            placeholder="Please select"
                        >
                        </El-select>
                    </El-form-item>
                <div class="dialog-footer">
                    <El-button> Cancel </El-button>
                    <El-button type="primary"> Confirm </El-button>
                </div>
            </El-dialog>
        </div>
    </div>
    <addBook v-if="bookVisible" @close="handleAddBookClose" />
    <bookDetailsDialog
        :book="bookDetails"
        :visible="dialogVisible"
        @close="closeDialog"
    />
</template>
<script lang="ts">
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import addBook from "@components/Book.vue";
import { useRouter } from "vue-router";
import { useUserStore } from '../store/index';

export default {
    props: {},
    components: {
        addBook,
    },
    setup() {
        const value = ref("");
        const input = ref("");
        const userStore = useUserStore();
        const tableData = ref([]);
        const bookVisible = ref(false);
        const bookDetails = ref(null);
        const dialogVisible = ref(false);
        const closeDialog = () => {
            dialogVisible.value = false;
        };
        const listQuery = ref({
            name: "",
            type: "",
        });
        const fetchBook = async () => {
            const url = "http://localhost:8080/api/getBook";
            const requestData = {
                name: listQuery.value.name.trim(),
            };
            try {
                const response = await axios.post(url, requestData);
                tableData.value = response.data.list;
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        const AddBook = () => {
            bookVisible.value = true;
        };
        const handleAddBookClose = () => {
            bookVisible.value = false;
        };
        const borrowingBook = async (row: { inventoryId: any; }) => {
            const url = "http://localhost:8080/api/book/borrowing";
            try {
                const requestData = {
                    userId: userStore.userId,
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);
                const { message } = response.data;
                if (response.data.message === "成功") {
                    console.log(response.data);
                    alert(`${message}`);
                } else {
                    alert(`${message}`);
                }
            } catch (error) {
                alert(`借閱請求錯誤`);
                console.error("Error borrowing book:", error);
            }
            fetchBook();
        };
        const returnBook = async (row: { inventoryId: any; }) => {
            const url = "http://localhost:8080/api/book/return";
            try {
                const requestData = {
                    userId: userStore.userId,
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);
                const { message } = response.data;
                if (response.data.message === "成功") {
                    console.log(response.data);
                    alert(`${message}`);
                } else if (response.data.message === "沒有借閱紀錄") {
                    alert(`${message}`);
                } else {
                    alert(`${message}`);
                }
            } catch (error) {
                alert("還書請求錯誤");
                console.error("Error return book:", error);
            }
            fetchBook();
        };
        const stock = async (row: { inventoryId: any; }) => {
            const url = "http://localhost:8080/api/book/stock";
            try {
                const requestData = {
                    userId: userStore.userId,
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);
                const { message } = response.data;
                if (response.data.message === "整理中") {
                    console.log(response.data);
                    alert(`${message}`);
                } else {
                    alert(`${message}`);
                }
            } catch (error) {
                alert("入庫請求失敗");
                console.error("Error stock :", error);
            }
            fetchBook();
        };
        const lost = async (row: { inventoryId: any; }) => {
            const url = "http://localhost:8080/api/book/lost";
            try {
                const requestData = {
                    userId: userStore.userId,
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);
                const { message } = response.data;
                if (response.data.message === "遺失") {
                    console.log(response.data);
                    alert(`${message}`);
                }
            } catch (error) {
                alert("登記請求失敗");
                console.error("Error lost :", error);
            }
            fetchBook();
        };
        const damaged = async (row: { inventoryId: any; }) => {
            const url = "http://localhost:8080/api/book/damaged";
            try {
                const requestData = {
                    userId: userStore.userId,
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);
                const { message } = response.data;
                if (response.data.message === "損毀") {
                    console.log(response.data);
                    alert(`${message}`);
                }
            } catch (error) {
                alert("登記請求失敗");
                console.error("Error damaged :", error);
            }
            fetchBook();
        };
        const scrap = async (row: { inventoryId: any; }) => {
            const url = "http://localhost:8080/api/book/scrap";
            try {
                const requestData = {
                    userId: userStore.userId,
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);
                const { message } = response.data;
                if (response.data.message === "報廢") {
                    console.log(response.data);
                    alert(`${message}`);
                }
            } catch (error) {
                alert("登記請求失敗");
                console.error("Error scrap :", error);
            }
            fetchBook();
        };
        const form = ref({
            inventoryId: "",
            isbn: "",
            name: "",
            status: "",
        });
        // 進網頁時自動刷新列表
        onMounted(() => {
            fetchBook();
        });
        const router = useRouter();
        const logout = () => {
            const userStore = useUserStore();
            console.log("userStore:", userStore);
            userStore.clearUser();
            router.push("/login");
        };
        return {
            value,
            input,
            tableData,
            userStore,
            bookVisible,
            bookDetails,
            dialogVisible,
            closeDialog,
            listQuery,
            form,
            fetchBook,
            logout,
            AddBook,
            handleAddBookClose,
            borrowingBook,
            returnBook,
            stock,
            lost,
            damaged,
            scrap,
        };
    },
};
</script>
<style lang="scss" scoped>
.filter-container {
    display: flex;
    align-items: center;
    padding: 0 42px;
    padding-top: 42px;
}

.list-container {
    display: flex;
    align-items: center;
    padding: 26px;
}

.example-pagination-block + .example-pagination-block {
    margin-top: 10px;
}
</style>
