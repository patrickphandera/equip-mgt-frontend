<template>
  <v-layout >
    <v-navigation-drawer app class="elevation-1">
      <div
        class="  my-4 mx-4 py-1 mb-6"
        style="border-left: 2px solid green ; border-right: 2px solid #948b8b; border-top: 2px solid black; ; border-bottom: 2px solid #948b8b; "
      ><div class="px-4 py-1">
      <!-- <v-avatar image="/images.png" size="24"></v-avatar> -->
      Min of Information</div>
      <div class="px-4 pb-1 text-bold">
        Equipment Booking
      </div>
        
      </div>
      <v-list class="mx-4" density="comfortable">
        <v-list-item
          to="/"
          title="Dashboard"
          class="my-3"
          @focus="focusedItem = 'home'"
          @blur="focusedItem = null"
          :class="isActiveRoute('/') "
        >
          <template v-slot:prepend>
            <v-icon color="gray">mdi-view-dashboard</v-icon>
          </template>
          </v-list-item
        >
        <v-list-item
          to="/users"
          class="mb-3"
          title="Users"
          @focus="focusedItem = 'users'"
          @blur="focusedItem = null"
          :class="isActiveRoute('/users')"
        >
          <template v-slot:prepend>
            <v-icon color="gray">mdi-account-multiple</v-icon>
          </template>
          </v-list-item
        >
        <v-list-item
          to="/bookings"
          class="mb-3"
          title="Bookings"
          @focus="focusedItem = 'bookings'"
          @blur="focusedItem = null"
          :class="isActiveRoute('/bookings')"
        >
          <template v-slot:prepend>
            <v-icon color="gray">mdi-checkbox-marked-circle</v-icon>
          </template>
        </v-list-item>
        <v-list-item
          to="/equipments"
          class="mb-3"
          title="Equipments"
          @focus="focusedItem = 'equipments'"
          @blur="focusedItem = null"
          :class="isActiveRoute('/equipments')"
        >
          <template v-slot:prepend>
            <v-icon color="gray">mdi-dots-hexagon</v-icon>
          </template>
          </v-list-item
        >
        <v-list-item
          to="/locations"
          class="mb-3"
          title="Locations"
          @focus="focusedItem = 'locations'"
          @blur="focusedItem = null"
          :class="isActiveRoute('/locations')"
        >
          <template v-slot:prepend>
            <v-icon color="gray">mdi-map-marker-multiple</v-icon>
          </template>
        </v-list-item>
        <v-list-item
          to="/payments"
          class="mb-3"
          title="Payments"
          @focus="focusedItem = 'payments'"
          @blur="focusedItem = null"
          :class="isActiveRoute('/payments')"
        >
          <template v-slot:prepend>
            <v-icon color="gray">mdi-cash-multiple</v-icon>
          </template>
        </v-list-item>

        <v-list-item
          to="/about"
          class="mb-3"
          title="About"
          @focus="focusedItem = 'about'"
          @blur="focusedItem = null"
          :class="isActiveRoute('/about')"
        >
          <template v-slot:prepend>
            <v-icon color="gray">mdi-information</v-icon>
          </template>
          </v-list-item
        >
      </v-list>
    </v-navigation-drawer>

    <v-main>
        <div class="px-4 my-4">
          <v-app>
            <Header></Header>
            <div class="bg-green-200">
            <slot />
          </div>
          </v-app>
        </div>
      
    </v-main>
  </v-layout>
</template>

<script>
 import Header from '@/components/Header.vue'
export default {
    components: {
        Header
    },
  data() {
    return {
      focusedItem: null,
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    },
  },
  methods: {
    isActiveRoute(path) {
      return {
        "focused-item": this.currentPath === path,
        "unfocused-item": this.currentPath !== path,
      };
    },
  },
};
</script>

<style scoped>
.focused-item {
  border-left: 2px solid red;
}
.unfocused-item {
  border: 0px solid #948b8b;
  
}
</style>
