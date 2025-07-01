<template>
  <v-app>
    <!-- Top App Bar -->
    <v-app-bar class="px-16 border" elevation="0">
      <div class="d-flex align-center">
        <div class="text-overline font-weight-bold mx-2">
          <span>Audio</span><span class="text-green">Visual</span>
        </div>


      </div>

      <v-spacer></v-spacer>

      <v-btn class="text-caption mx-2  bg-green">Login</v-btn>
      <v-btn text class="text-caption">About us</v-btn>
    </v-app-bar>
    <!-- Main Content -->
    <v-container class="my-16 text-center">

      <div class="mt-2" v-show="showSelect">

        <div class="px-4 text-center">
          <v-dialog max-width="800" class="pb-8">
            <template v-slot:default="{ isActive }">
              <v-card title="Adding New Equipment">
                <template v-slot:text>
                  <v-form>
                    <v-row>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Equipment name" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Category" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Serial number" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Current condition" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Availability" />
                      </v-col>
                      <v-col cols="12" sm="6">
                        <v-text-field label="Procurement date" />
                      </v-col>
                    </v-row>
                  </v-form>
                </template>
                <v-card-actions class="pb-4">
                  <v-spacer></v-spacer>
                  <v-btn text="Close" variant="dense" class="text-capitalize bg-blue-grey-lighten-4"
                    @click="isActive.value = false" />
                  <v-btn color="surface-variant" class="text-capitalize bg-primary" text="Add" variant="flat"
                    @click="isActive.value = false" />
                </v-card-actions>
              </v-card>
              <v-spacer></v-spacer>
            </template>
          </v-dialog>
        </div>

        <v-row class="mt-4">
          <v-col cols="6" v-for="equipment in equipments" :key="equipment.id">
            <v-card hover class="  mx-auto" @click=" toggleSelection(equipment)">
              <v-img class="align-end" style="height: 200px;" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                :src="`${API_BASE_URL}/files/${equipment.image}`" cover>
                <div class="mt-8 d-flex justify-center">

                  <div class="d-flex justify-space-between text-body-2 font-weight-black">
                    <v-btn
                      class="text-uppercase ma-2 bg-black pa-1 rounded-lg font-weight-black text-white px-4 py-2 text-overline">

                      {{equipment.name}}
                    </v-btn>
                  </div>
                </div>
                <div class="d-flex pa-2 justify-center">
                  <v-btn stacked class="bg-green-darken-4 d-flex">

                    <div class="text-caption">MWK</div>

                    <div class="text-body-4 font-weight-black">{{ equipment.price }}.00</div>
                  </v-btn>
                </div>
              </v-img>

            </v-card>
          </v-col>
        </v-row>
      </div>


    </v-container>

    <!-- Footer -->
    <v-app-bar dense location="bottom" class="text-center border" elevation="1">
      <v-container class="d-flex justify-center align-center">
        <div class="text-caption">&copy; Ministry of Information</div>
      </v-container>
    </v-app-bar>
  </v-app>
</template>


<script>

  import { ref, onMounted, watch } from "vue";
  import { getAllData, postData, putData, deleteData } from "../services/rest.services";

  export default {
    data() {
      return {
        toggle: false,
        API_BASE_URL: 'https://audio-visual-backend.onrender.com',
        showSelect: true,
        equipments: [],
      }
    },
    methods: {
      async fetchEquipments() {
        this.loading = true;
        try {
          const res = await getAllData("equipment_sets");
          const dbEquipments = res?.equipment_sets || [];

          // Normalize data
          this.equipments = dbEquipments.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category, // optionally map ID to name
            image: item.pictures[0] || '/equips/default.jpg',
            price: item.bookingCost || '0',
            availability: item.availability || '',
            selected: false,
            quantity: 1,
          }));
        } catch (e) {
          console.error("Error loading equipments:", e);
        } finally {
          this.loading = false;
        }
      },

      async loadItems({ page, itemsPerPage }) {
        loading.value = true;
        try {
          const res = await getAllData("equipments");
          let allItems = res.equipments || [];

          const res1 = await getAllData("equipment_categories");
          categories.value = res1.equipment_categories || [];
          categoryItems.value = categories.value.map(cat => cat.name);

          const res2 = await getAllData("equipment_conditions");
          conditions.value = res2.equipment_conditions || [];
          conditionItems.value = conditions.value.map(cond => cond.name);

          const res3 = await getAllData("equipment_availabilities");
          availability.value = res3.equipment_availabilities || [];
          availabilityItems.value = availability.value.map(avail => avail.name);

          allItems = allItems.map(item => {
            const category = categories.value.find(c => c.id === item.category_id);
            const condition = conditions.value.find(c => c.id === item.condition);
            const avail = availability.value.find(a => a.id === item.availability);

            return {
              ...item,
              category_id: category?.name || item.category_id,
              condition: condition?.name || item.condition,
              availability: avail?.name || item.availability,
            };
          });

          if (search.value.trim()) {
            const term = search.value.toLowerCase();
            allItems = allItems.filter(
              item =>
                item.name?.toLowerCase().includes(term) ||
                item.category_id?.toLowerCase().includes(term) ||
                item.serial_number?.toLowerCase().includes(term) ||
                item.condition?.toLowerCase().includes(term) ||
                item.availability?.toLowerCase().includes(term)
            );
          }

          const start = (page - 1) * itemsPerPage;
          serverItems.value = allItems.slice(start, start + itemsPerPage);
          totalItems.value = allItems.length;

          showSnack("Equipments loaded", "success");
        } catch (e) {
          console.error(e);
          showSnack("Failed to load", "error");
        } finally {
          loading.value = false;
        }
      },
      toggleSelection(equipment) {
        equipment.selected = !equipment.selected

        if (!equipment.selected) {
          equipment.quantity = null
        } else {
          this.toggle = true
        }
      },
      next() {
        let equipments = []
        this.equipments.forEach(equipment => {
          if (equipment.selected == true) {
            equipments.push({ id: equipment.id, quantity: equipment.quantity, })
          }

        });

        localStorage.setItem('equipments', JSON.stringify(equipments));
      },
      goBackToSelection() {
        this.showSelect = true
      },
    },
    mounted() {
      this.fetchEquipments();
    },


  }
</script>

<style>
  .gradient-box {
    background: linear-gradient(135deg, #2a7cac, #00bf72);
  }
</style>