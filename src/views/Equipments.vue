<template>
  <v-app class="">

    <v-app-bar class="px-16 border" elevation="0">
      <v-btn class="text-caption text-xs" to="/">
        <div class="d-flex align-center">
          <div class="text-overline font-weight-bold mx-2">
            <span>Audio</span><span class="text-green">Visual</span>
          </div>
        </div>
      </v-btn>
      <v-spacer></v-spacer>

      <v-btn class="text-caption mx-2  bg-green" to="/login">Login</v-btn>
      <v-btn text class="text-caption bg-blue-grey-lighten-5">About us</v-btn>
    </v-app-bar>
    <!-- Main Content -->

    <v-container class="my-16">
      <div>
        <div class="text-overline font-weight-medium ">Equipments</div>
        <div class="text-caption">
          Currently we are offering these varieties of equipments,
          Please <span class="text-green">
            <v-btn to="/login" class="text-caption mx-1" variant="text" dense size="xs"> Log in</v-btn>
          </span>first to get started with bookings
        </div>
      </div>
      <div>
        <v-row class="mt-2">
          <v-col cols="6" v-for="equipment in equipments" :key="equipment.id">
            <v-card hover class="  mx-auto" @click=" toggleSelection(equipment)">
              <v-img class="align-end" style="height: 180px;" gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
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

<style scoped>
  .gradient-box {
    background: linear-gradient(135deg, #FAFAFA, #C8E6C9);
  }
</style>