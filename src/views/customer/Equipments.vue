<template>
  <v-app>
    <div class="mt-2" v-show="showSelect">
      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="text-overline font-weight-medium ">Equipments</div>
          <div class="text-caption">
            Select equipment sets you want to book and click
            <span class="text-green">next button</span> at the bottom end to
            proceed to <span class="text-green">fill in important details</span>
          </div>

        </div>

        <div class="text-overline ">1/3</div>

      </div>


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
      <div class="scroll-box">




        <v-row class="mt-4 scroll-content ">

          <v-col cols="6" md="4" v-for="equipment in equipments" :key="equipment.id">
            <v-card hover class="  mx-auto" :class="{ selected: equipment.selected }"
              @click="toggleSelection(equipment)">
              <v-img class="align-end" :style="{ height: equipment.selected ? '177px' : '180px' }"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)" :src="`${API_BASE_URL}/files/${equipment.image}`"
                cover>
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
        <div class="d-flex justify-end">
          <v-btn class="bg-green text-capitalize" append-icon="mdi-chevron-right" @click="showSelect = false;next()">
            next
          </v-btn>
        </div>
      </div>

    </div>

    <div v-show="!showSelect">
      <Inputs :back="goBackToSelection" :equipments="equipments" @update-message="showSelect = $event" />
    </div>
  </v-app>
</template>

<script>
  import Inputs from './Equipment.vue'
  import { ref, onMounted, watch } from "vue";
  import { getAllData, postData, putData, deleteData } from "../../services/rest.services";

  export default {
    components: { Inputs },
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
            category: item.category,
            image: item.pictures[0] || '/equips/default.jpg',
            numberOfTechnicians: item.numberOfTechnicians || 0,
            technicianAllowance: item.technicianAllowance || 0,
            transportNeeded: item.transportNeeded || false,
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
  .scroll-box {
    height: 500px;
    overflow-y: auto;

  }

  .scroll-content {
    padding: 10px;
  }
</style>






















<style scoped>
  .selected {
    border: 2px solid green;
  }
</style>