<template>
  <v-layout>
    <v-navigation-drawer app class="elevation-1" hover>
      <div
        class="text-overline border-left-green border-right border-bottom border-top-green  mt-5 mx-4 text-h5 font-weight-black mb-6 elevation-0 pa-4 text-center">

        Audio<span class="text-primary">Visual</span>

      </div>
      <v-list class="mx-4" density="comfortable">
        <v-list-item hover to="/customer/dashboard" title="" class="my-3  text-overline"
          @focus="focusedItem = 'dashboard'" @blur="focusedItem = null" :class="isActiveRoute('customer/dashboard') ">
          Dashboard
          <template v-slot:prepend>
            <v-icon color="gray">mdi-view-dashboard</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/customer/equipments" class="mb-3 text-overline" title="" @focus="focusedItem = 'equipments'"
          @blur="focusedItem = null" :class="isActiveRoute('/customer/equipments')">
          Equipments
          <template v-slot:prepend>
            <v-icon color="gray">mdi-checkbox-blank-badge-outline</v-icon>
          </template>
        </v-list-item>

        <v-list-item to="/customer/bookings" class="mb-3 text-overline" title="" @focus="focusedItem = 'bookings'"
          @blur="focusedItem = null" :class="isActiveRoute('/customer/bookings')">
          My Bookings
          <template v-slot:prepend>
            <v-icon color="gray">mdi-clipboard-text-clock-outline</v-icon>
          </template>
        </v-list-item>

        <!-- <v-list-item to="/customer/locations" class="mb-3" title="Locations" @focus="focusedItem = 'locations'"
          @blur="focusedItem = null" :class="isActiveRoute('/customer/locations')">
          <template v-slot:prepend>
            <v-icon color="gray">mdi-map-marker-multiple</v-icon>
          </template>
        </v-list-item> -->
        <v-list-item to="/customer/payments" class="mb-3 text-overline" title="" @focus="focusedItem = 'payments'"
          @blur="focusedItem = null" :class="isActiveRoute('/customer/payments')">
          My Payments
          <template v-slot:prepend>

            <v-icon color="gray">mdi-cash-clock</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/customer/account" class="mb-3 text-overline" title="" @focus="focusedItem = 'account'"
          @blur="focusedItem = null" :class="isActiveRoute('/customer/account')">
          My Account
          <template v-slot:prepend>
            <v-icon color="gray">mdi-account-cog</v-icon>
          </template>
        </v-list-item>
        <!-- <v-list-item
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
          > -->
      </v-list>
      <div class="d-flex justify-center text-overline">
        <footer class="mt-8 text-center  border-t mx-4"
          style="position: relative; bottom: 0; width: 100%; text-align: center; padding: 10px 0;">
          &copy; Ministry of Information
        </footer>
      </div>
    </v-navigation-drawer>

    <v-main>
      <div class="px-4 my-4">
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
    border-left: 2px solid rgb(49, 153, 49);
  }

  .unfocused-item {
    border: 0px solid #948b8b;


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