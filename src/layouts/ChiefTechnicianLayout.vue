<template>
  <v-layout class="">
    <v-navigation-drawer app class="elevation-1">
      <div
        class="border-left-green border-right border-bottom border-top-green  mt-5 mx-4 text-h5 font-weight-black mb-6 elevation-0 pa-4 text-center">

        Audio<span class="text-primary">Visual</span>

      </div>

      <v-list class="mx-4 " density="comfortable">
        <v-list-item to="/chief-technician/dashboard" title="" class="my-3 text-overline" @focus="focusedItem = 'home'"
          @blur="focusedItem = null" :class="isActiveRoute('/chief-technician/dashboard') ">
          Dashboard
          <template v-slot:prepend>
            <v-icon color="gray">mdi-view-dashboard</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/chief-technician/users" class="mb-3 text-overline" title="" @focus="focusedItem = 'users'"
          @blur="focusedItem = null" :class="isActiveRoute('/chief-technician/users')">
          Users
          <template v-slot:prepend>
            <v-icon color="gray">mdi-account-multiple</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/chief-technician/bookings" class="mb-3 text-overline" title=""
          @focus="focusedItem = 'bookings'" @blur="focusedItem = null"
          :class="isActiveRoute('/chief-technician/bookings')">
          Bookings
          <template v-slot:prepend>
            <v-icon color="gray">mdi-format-list-bulleted</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/chief-technician/technicians" class="mb-3 text-overline" title=""
          @focus="focusedItem = 'technicians'" @blur="focusedItem = null"
          :class="isActiveRoute('/chief-technician/technicians')">
          Technicians
          <template v-slot:prepend>
            <v-icon color="gray">mdi-format-list-bulleted</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/chief-technician/equipments" class="mb-3 text-overline" title=""
          @focus="focusedItem = 'equipments'" @blur="focusedItem = null"
          :class="isActiveRoute('/chief-technician/equipments')">
          Equipments
          <template v-slot:prepend>
            <v-icon color="gray">mdi-format-list-bulleted-square</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/chief-technician/locations" class="mb-3 " title="" @focus="focusedItem = 'locations'"
          @blur="focusedItem = null" :class="isActiveRoute('/chief-technician/locations')">
          Locations
          <template v-slot:prepend>
            <v-icon color="gray">mdi-format-list-bulleted-triangle</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/chief-technician/payments" class="mb-3 text-overline" title=""
          @focus="focusedItem = 'payments'" @blur="focusedItem = null"
          :class="isActiveRoute('/chief-technician/payments')">
          Payments
          <template v-slot:prepend>
            <v-icon color="gray">mdi-list-status</v-icon>
          </template>
        </v-list-item>
      </v-list>
      <div class="d-flex justify-center">
        <footer class="mt-8 mx-4 text-center  border-t"
          style="position: relative; bottom: 0; width: 100%; text-align: center; padding: 10px 0;">
          &copy; Ministry of Information
        </footer>
      </div>
    </v-navigation-drawer>

    <v-main>
      <div class="px-4 my-4 ">
        <v-app>
          <Header></Header>
          <div>
            <router-view /> <!-- This is REQUIRED -->
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
    border-left: 2px solid #4CAF50;
  }

  .unfocused-item {
    border: 0px solid #948b8b;

  }

  .scroll-hidden {
    max-height: 100vh;
    overflow-y: scroll;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
  }

  .scroll-hidden::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera */
  }

  .border-left-green {
    border-left: 2px solid #28832b;
    /* Material green */
  }

  .border-top-green {
    border-top: 2px solid #2e9e32;
    /* Material green */
  }

  .border-bottom {
    border-bottom: 2px solid #e8ebe8;
  }

  .border-right {
    border-right: 2px solid #e8ebe8;
  }
</style>