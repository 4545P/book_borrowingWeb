<template>
    <div class="app">
        <div class="app-container" style="width: 90vw; margin: 0 auto">
            <div class="filter-container">
                <el-input
                    v-model="listQuery.name"
                    placeholder="name"
                    style="width: 180px; height: 65px"
                    class="filter-item"
                />

                <el-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="fetchBook"
                    >Search</el-button
                >
                <el-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="AddBook"
                >
                    AddBook
                </el-button>
                <el-button
                    type="primary"
                    round
                    style="margin-left: 12px"
                    @click="logout"
                    >LogOut</el-button
                >
            </div>

            <div class="list-container">
                <el-table
                    :data="tableData"
                    border
                    fit
                    highlight-current-row
                    style="width: 100%"
                >
                    <el-table-column
                        label="ID"
                        prop="inventoryId"
                        align="center"
                        width="70"
                    >
                        <template #default="{ row }">
                            <span>{{ row.inventoryId }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="ISBN" prop="isbn" min-width="70px">
                        <template #default="{ row }">
                            <span class="link-type">{{ row.isbn }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="Name" prop="name" min-width="70px">
                        <template #default="{ row }">
                            <span class="link-type">{{ row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="Status"
                        prop="status"
                        min-width="70px"
                    >
                        <template #default="{ row }">
                            <span class="link-type">{{ row.status }}</span>
                        </template>
                    </el-table-column>

                    <el-table-column
                        label="Operate"
                        align="center"
                        width="750"
                        class-name="small-padding fixed-width"
                    >
                        <template #default="{ row }">
                            <el-button
                                type="primary"
                                round
                                @click="borrowingBook(row)"
                                >borrowingBook</el-button
                            >
                            <el-button
                                type="success"
                                round
                                @click="returnBook(row)"
                                >returnBook</el-button
                            >
                            <el-button round @click="stock(row)"
                                >stock</el-button
                            >
                            <el-button type="info" round @click="lost(row)"
                                >lost</el-button
                            >
                            <el-button
                                type="warning"
                                round
                                @click="damaged(row)"
                                >damaged</el-button
                            >
                            <el-button type="danger" round @click="scrap(row)"
                                >scrap</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <el-dialog title="Chart" width="70%">
                    <div class="chart-container">
                        <div
                            id="pieChart"
                            style="width: 100%; height: 400px"
                        ></div>
                    </div>
                    <span class="dialog-footer">
                        <el-button>Close</el-button>
                    </span>
                </el-dialog>
            </div>

            <el-dialog>
                <el-form
                    ref="dataForm"
                    :rules="rules"
                    :model="listQuery"
                    label-position="left"
                    label-width="70px"
                    style="width: 400px; margin-left: 50px"
                >
                    <el-form-item label="Type" prop="type">
                        <el-select
                            v-model="listQuery.type"
                            class="filter-item"
                            placeholder="Please select"
                        >
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer">
                    <el-button> Cancel </el-button>
                    <el-button type="primary"> Confirm </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
    <addBook v-if="bookVisible" @close="handleAddBookClose" />
    <bookDetailsDialog
        :book="bookDetails"
        :visible="dialogVisible"
        @close="closeDialog"
    />
</template>

<script>
import { ref, onMounted } from "vue";
import axios from "axios";
import addBook from "../components/Book.vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../store/index";
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
        const listQuery = ref({
            name: "",
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

        const borrowingBook = async (row) => {
            const url = "http://localhost:8080/api/book/borrowing";
            try {
                const requestData = {
                    userId: userStore.userId,
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);

                if (response.data.message === "借閱成功") {
                    console.log(response.data);
                    alert("借閱成功");
                    fetchBook();
                } else {
                    alert("借閱失敗");
                }
            } catch (error) {
                alert("借閱失敗");
                console.error("Error borrowing book:", error);
            }
        };

        const returnBook = async (row) => {
            const url = "http://localhost:8080/api/book/return";
            try {
                const requestData = {
                    userId: userStore.userId,
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);

                if (response.data.message === "還書成功") {
                    console.log(response.data);
                    alert("還書成功");
                    fetchBook();
                } else if (response.data.message === "沒有借閱紀錄") {
                    alert("沒有借閱紀錄");
                } else {
                    alert("還書失敗");
                }
            } catch (error) {
                alert("還書失敗");
                console.error("Error return book:", error);
            }
        };

        const stock = async (row) => {
            const url = "http://localhost:8080/api/book/stock";
            try {
                const requestData = {
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);

                if (response.data.message === "在庫") {
                    console.log(response.data);
                    alert("整理完成 入庫");
                    fetchBook();
                }
            } catch (error) {
                alert("入庫失敗");
                console.error("Error stock :", error);
            }
        };

        const lost = async (row) => {
            const url = "http://localhost:8080/api/book/lost";
            try {
                const requestData = {
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);

                if (response.data.message === "遺失") {
                    console.log(response.data);
                    alert("登記遺失");
                    fetchBook();
                }
            } catch (error) {
                alert("登記失敗");
                console.error("Error lost :", error);
            }
        };

        const damaged = async (row) => {
            const url = "http://localhost:8080/api/book/damaged";
            try {
                const requestData = {
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);

                if (response.data.message === "損毀") {
                    console.log(response.data);
                    alert("登記損毀");
                    fetchBook();
                }
            } catch (error) {
                alert("登記失敗");
                console.error("Error damaged :", error);
            }
        };

        const scrap = async (row) => {
            const url = "http://localhost:8080/api/book/scrap";
            try {
                const requestData = {
                    inventoryId: row.inventoryId,
                };
                const response = await axios.post(url, requestData);

                if (response.data.message === "報廢") {
                    console.log(response.data);
                    alert("登記報廢");
                    fetchBook();
                }
            } catch (error) {
                alert("登記失敗");
                console.error("Error scrap :", error);
            }
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
