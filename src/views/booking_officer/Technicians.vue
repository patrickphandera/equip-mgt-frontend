<template>
    <v-app>
        <!-- Title and New Technician Button -->
        <div class="mt-2">

            <div class="d-flex justify-space-between align-end mt-2">
                <div class="d-flex flex-column">
                    <h2 class="text-overline font-weight-medium">Users</h2>
                    <div class="text-caption">
                        Technicians Management
                    </div>
                </div>
                <div class="px-4 text-center">
                    <v-dialog v-model="createDialog" max-width="800">
                        <template v-slot:activator="{ props }">
                            <v-btn color="green" variant="elevated" prepend-icon="mdi-plus"
                                class="text-capitalize text-caption" v-bind="props" @click="resetForm">
                                New Technician
                            </v-btn>
                        </template>

                        <v-card title="Add New Technician">
                            <v-form class="px-4">
                                <v-row>
                                    <v-col cols="12" sm="6">
                                        <v-autocomplete label="Technician Name" v-model="form.userId" required
                                            :items="users" />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Phone" v-model="form.phone" required />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Email" v-model="form.email" type="email" required />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-text-field label="Recent Schedule" v-model="form.recentSchedule" required />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-combobox v-model="form.busyDays" label="Busy Days"
                                            :items="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
                                            multiple chips clearable required />
                                    </v-col>
                                    <v-col cols="12" sm="6">
                                        <v-select label="Status" v-model="form.activeStatus"
                                            :items="['active', 'inactive']" required />
                                    </v-col>
                                </v-row>
                            </v-form>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn @click="createDialog = false" class="bg-grey text-capitalize">Close</v-btn>
                                <v-btn color="white" @click="createTechnician"
                                    class="bg-green text-capitalize">Add</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
            </div>
        </div>

        <!-- Technician Data Table -->
        <v-card class="elevation-1 mt-4">
            <v-card-text>
                <v-text-field density="compact" v-model="search" label="Search technicians"
                    prepend-inner-icon="mdi-magnify" clearable />
            </v-card-text>

            <v-data-table-server class="text-caption" v-model:items-per-page="itemsPerPage" :headers="headers"
                :items="serverItems" :items-length="totalItems" :loading="loading" item-value="userId"
                @update:options="loadItems">
                <template #item.busyDays="{ item }">
                    {{ item.busyDays.join(', ') }}
                </template>
                <template #item.recentSchedule="{ item }">
                    <Schedules :technician="item"></Schedules>
                </template>
                <template #item.actions="{ item }">
                    <div class="d-flex">
                        <!-- Edit Dialog -->
                        <v-dialog v-model="editDialog" max-width="800">
                            <template v-slot:activator="{ props }">
                                <v-btn icon size="small" variant="flat" v-bind="props" @click="editTechnician(item)">
                                    <v-icon>mdi-pencil</v-icon>
                                </v-btn>
                            </template>
                            <v-card title="Update Technician">
                                <v-form class="px-4">
                                    <v-row>
                                        <v-col cols="12" sm="6">
                                            <v-autocomplete label="User ID" v-model="form.userId" required
                                                :items="users" />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field label="Phone" v-model="form.phone" required />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field label="Email" v-model="form.email" type="email" required />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-text-field label="Recent Schedule" v-model="form.recentSchedule"
                                                required />
                                        </v-col>
                                        <v-col cols="12">
                                            <v-combobox v-model="form.busyDays" label="Busy Days"
                                                :items="['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']"
                                                multiple chips clearable required />
                                        </v-col>
                                        <v-col cols="12" sm="6">
                                            <v-select label="Status" v-model="form.activeStatus"
                                                :items="['active', 'inactive']" required />
                                        </v-col>
                                    </v-row>
                                </v-form>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn @click="editDialog = false" class="text-capitalize bg-grey">Cancel</v-btn>
                                    <v-btn color="white" @click="updateTechnician"
                                        class="text-capitalize bg-green">Update</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>

                        <!-- Delete Button -->
                        <v-btn icon size="small" variant="flat" @click="confirmDelete(item)">
                            <v-icon color="red">mdi-delete</v-icon>
                        </v-btn>
                    </div>
                </template>
            </v-data-table-server>
        </v-card>

        <!-- Confirm Delete Dialog -->
        <v-dialog v-model="confirmDialog" max-width="400">
            <v-card>
                <v-card-title class="text-h6">Confirm Delete</v-card-title>
                <v-card-text>
                    Are you sure you want to delete <strong>{{ selectedItem?.userId }}</strong>?
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="confirmDialog = false" class="text-capitalize bg-grey">Close</v-btn>
                    <v-btn @click="deleteConfirmed" class="text-capitalize bg-red text-white">Delete</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar -->
        <v-snackbar-queue v-model="snackbars" :timeout="2000" />
    </v-app>
</template>

<script setup>
    import Schedules from './TechnicianSchedules.vue'
    import { ref, onMounted, watch } from 'vue';
    import { getAllData, postData, putData, deleteData } from '../../services/rest.services';

    const headers = [
        { title: 'Technician Name', key: 'userId' },
        { title: 'Phone', key: 'phone' },
        { title: 'Email', key: 'email' },
        { title: 'Schedule', key: 'recentSchedule' },
        { title: 'Busy Days', key: 'busyDays' },
        { title: 'Status', key: 'activeStatus' },
        { title: 'Actions', key: 'actions', sortable: false }
    ];

    const form = ref({
        id: null,
        userId: '',
        recentSchedule: '',
        busyDays: [],
        phone: '',
        email: '',
        activeStatus: 'active'
    });

    const search = ref('');
    const itemsPerPage = ref(5);
    const serverItems = ref([]);
    const totalItems = ref(0);
    const loading = ref(false);
    const snackbars = ref([]);
    const users = ref([]);
    const createDialog = ref(false);
    const editDialog = ref(false);
    const confirmDialog = ref(false);
    const selectedItem = ref(null);

    const resetForm = () => {
        form.value = {
            id: null,
            userId: '',
            recentSchedule: '',
            busyDays: [],
            phone: '',
            email: '',
            activeStatus: 'active'
        };
    };

    const loadItems = async ({ page, itemsPerPage }) => {
        loading.value = true;
        try {
            const res = await getAllData('technicians');
            let allItems = res.technicians || [];
            const res1 = await getAllData('users');
            users.value = res1.users.map(user => (
                user.firstname + ' ' + user.lastname
            ));
            if (search.value.trim()) {
                const term = search.value.toLowerCase();
                allItems = allItems.filter(item =>
                    item.userId?.toLowerCase().includes(term) ||
                    item.email?.toLowerCase().includes(term)
                );
            }

            const start = (page - 1) * itemsPerPage;
            serverItems.value = allItems.slice(start, start + itemsPerPage);
            totalItems.value = allItems.length;

            showSnack('Technicians loaded', 'success');
        } catch (e) {
            console.error(e);
            showSnack('Failed to load technicians', 'error');
        } finally {
            loading.value = false;
        }
    };

    const createTechnician = async () => {
        try {
            await postData(form.value, 'technicians');
            createDialog.value = false;
            showSnack('Technician created', 'success');
            await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
        } catch (e) {
            showSnack(e.response?.data || 'Failed to create technician', 'error');
        }
    };

    const updateTechnician = async () => {
        try {
            await putData(form.value, `technicians/${form.value.id}`);
            editDialog.value = false;
            showSnack('Technician updated', 'success');
            await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
        } catch (e) {
            showSnack('Failed to update technician', 'error');
        }
    };

    const confirmDelete = (item) => {
        selectedItem.value = item;
        confirmDialog.value = true;
    };

    const deleteConfirmed = async () => {
        try {
            await deleteData(`technicians/${selectedItem.value.id}`);
            confirmDialog.value = false;
            showSnack('Technician deleted', 'success');
            await loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
        } catch (e) {
            showSnack('Failed to delete technician', 'error');
        }
    };

    const editTechnician = (item) => {
        form.value = { ...item };
        editDialog.value = true;
    };

    const showSnack = (text, color) => {
        snackbars.value.push({ text, color });
    };

    onMounted(() => {
        loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    });

    watch(search, () => {
        loadItems({ page: 1, itemsPerPage: itemsPerPage.value });
    });
</script>

<style scoped>
    .v-data-table .v-btn {
        margin: 0 2px;
    }
</style>