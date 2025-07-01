<template>
  <v-layout class="">
    <v-navigation-drawer app class="elevation-1">
      <div
        class="border-left-green border-right border-bottom border-top-green  mt-5 mx-4 text-h5 font-weight-black mb-6 elevation-0 pa-4 text-center text-overline">

        Audio<span class="text-primary">Visual</span>

      </div>

      <v-list class="mx-4 " density="comfortable">
        <v-list-item to="/accountant/dashboard" title="" class="my-3 text-overline  " @focus="focusedItem = 'home'"
          @blur="focusedItem = null" :class="isActiveRoute('/accountant') ">Dashboard
          <template v-slot:prepend>
            <v-icon color="gray">mdi-view-dashboard</v-icon>
          </template>
        </v-list-item>

        <v-list-item to="/accountant/bookings" class="mb-3 text-overline" title="" @focus="focusedItem = 'bookings'"
          @blur="focusedItem = null" :class="isActiveRoute('/accountant/bookings')">Bookings
          <template v-slot:prepend>
            <v-icon color="gray">mdi-format-list-bulleted</v-icon>
          </template>
        </v-list-item>
        <v-list-item to="/accountant/payments" class="mb-3 text-overline" title="" @focus="focusedItem = 'payments'"
          @blur="focusedItem = null" :class="isActiveRoute('/accountant/payments')">
          Payments<template v-slot:prepend>
            <v-icon color="gray">mdi-list-status</v-icon>
          </template>
        </v-list-item>
      </v-list>
      <div class="d-flex justify-left">

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