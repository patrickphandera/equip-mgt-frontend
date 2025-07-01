<template>
  <!-- Open Dialog Button -->
  <v-btn variant="flat" icon="mdi-playlist-star" @click="dialogVisible = true" />

  <!-- Add to Equipment Set Dialog -->
  <v-dialog v-model="dialogVisible" max-width="600">
    <v-card>
      <v-card-title class="headline">Add Items to Equipment Set</v-card-title>

      <v-card-text>
        <v-select
          label="Equipment Category"
          :items="categoryItems"
          v-model="selectedCategory"
        />

        <v-select
          label="Equipments"
          :items="filteredEquipments"
          multiple
          v-model="selectedEquipments"
        />

        <v-btn
          block
          class="bg-primary text-white mt-4"
          @click="addToSet"
        >
          Add
        </v-btn>
      </v-card-text>

      <!-- Equipment Table -->
      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="formattedEquipmentItems"
          class="elevation-1 mt-2"
          item-value="serial_number"
          hide-default-footer
          density="compact"
        >
          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="red"
              @click="requestDelete(item)"
            />
          </template>
        </v-data-table>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn class="bg-grey" @click="dialogVisible = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="confirmDialog" max-width="400">
    <v-card>
      <v-card-title class="text-h6">Confirm Deletion</v-card-title>
      <v-card-text>
        Are you sure you want to remove
        <strong>{{ itemToDelete?.serial_number }}</strong>
        from the set?
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="grey" @click="confirmDialog = false">Cancel</v-btn>
        <v-btn text color="red" @click="confirmDelete">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Snackbar Notifications -->
  <v-snackbar-queue v-model="snackbars" :timeout="2000" />
</template>

<script setup>
import { ref, defineProps, onMounted, computed } from "vue";
import { getAllData, postData, deleteData } from "../services/rest.services";

// Props
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

// UI State
const dialogVisible = ref(false);
const confirmDialog = ref(false);
const snackbars = ref([]);
const selectedCategory = ref(null);
const selectedEquipments = ref([]);
const itemToDelete = ref(null);

// Data
const equipment_categories = ref([]);
const allEquipments = ref([]);
const allConditions = ref([]);
const equipment_sets = ref([]);
const equipment_set_items = ref([]);

// Table Headers
const tableHeaders = [
  { title: "Serial Number", key: "serial_number" },
  { title: "Category", key: "category" },
  { title: "Condition", key: "condition" },
  { title: "Actions", key: "actions", sortable: false },
];

// Computed
const categoryItems = computed(() =>
  equipment_categories.value.map((cat) => cat.name)
);

const filteredEquipments = computed(() => {
  if (!selectedCategory.value) return [];
  return allEquipments.value
    .filter((eq) => {
      const category = equipment_categories.value.find(
        (c) => c.id === eq.category_id
      );
      return category?.name === selectedCategory.value;
    })
    .map((eq) => eq.name);
});

const formattedEquipmentItems = computed(() => {
  return equipment_set_items.value.map((item) => {
    const equip = getEquip(item.serial_number);
    return {
      serial_number: item.serial_number,
      category: getCategoryName(equip?.category_id),
      condition: getCond(equip?.condition),
      id: item.id,
    };
  });
});

// Utility Functions
const getCategoryName = (id) =>
  equipment_categories.value.find((cat) => cat.id === id)?.name || "Unknown";

const getEquip = (serial_number) =>
  allEquipments.value.find((equip) => equip.serial_number == serial_number);

const getCond = (id) =>
  allConditions.value.find((cond) => cond.id == id)?.name || "Unknown";

const showSnack = (text, color) => {
  snackbars.value.push({ text, color });
};

// Data Loaders
const getEquipmentsCategories = async () => {
  const res = await getAllData("equipment_categories");
  equipment_categories.value = res.equipment_categories || [];
};

const getEquipmentSets = async () => {
  const res = await getAllData("equipment_sets");
  equipment_sets.value = res.equipment_sets || [];
};

const getEquipments = async () => {
  const res = await getAllData("equipments");
  allEquipments.value = res.equipments || [];
};

const getEquipmentConditions = async () => {
  const res = await getAllData("equipment_conditions");
  allConditions.value = res.equipment_conditions || [];
};

const getEquipmentSetItems = async () => {
  const res = await getAllData("equipment_set_items");
  equipment_set_items.value = (res.equipment_set_items || []).filter(
    (item) => item.set_id === props.id
  );
};

// Submission Logic
const addToSet = async () => {
  if (!selectedEquipments.value.length) {
    showSnack("Please select at least one equipment", "error");
    return;
  }

  const payload = selectedEquipments.value
    .map((equipmentName) => {
      const eq = allEquipments.value.find((e) => e.name === equipmentName);
      return eq ? { serial_number: eq.serial_number, set_id: props.id } : null;
    })
    .filter(Boolean);

  for (const item of payload) {
    try {
      await postData(item, "equipment_set_items");
      showSnack(`Item added: ${item.serial_number}`, "green");
    } catch (e) {
      showSnack(
        `Failed: ${item.serial_number} – ${
          e?.response?.data?.detail || "error"
        }`,
        "red"
      );
    }
  }

  selectedCategory.value = null;
  selectedEquipments.value = [];
  await getEquipmentSetItems();
};

// Delete Logic
const requestDelete = (item) => {
  itemToDelete.value = item;
  confirmDialog.value = true;
};

const confirmDelete = async () => {
  const item = itemToDelete.value;
  if (!item) return;

  try {
    await deleteData(`equipment_set_items/${item.id}`);
    showSnack(`Item removed: ${item.serial_number}`, "green");
    await getEquipmentSetItems();
  } catch (e) {
    showSnack(
      `Failed: ${item.serial_number} – ${
        e?.response?.data?.detail || "error"
      }`,
      "red"
    );
  } finally {
    confirmDialog.value = false;
    itemToDelete.value = null;
  }
};

// On Mount
onMounted(async () => {
  await Promise.all([
    getEquipmentsCategories(),
    getEquipments(),
    getEquipmentSets(),
    getEquipmentConditions(),
    getEquipmentSetItems(),
  ]);
});
</script>
