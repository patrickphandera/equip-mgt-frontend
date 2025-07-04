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

      <v-btn text class="text-caption mx-2 bg-green" to="/login">Login</v-btn>
      <v-btn text class="text-caption bg-blue-grey-lighten-5">About us</v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-container class="my-16 text-center">

      <v-row justify="center">
        <v-col cols="12" md="8">
          <div class="text-h3 font-weight-black mb-4 mt-8 text-uppercase text-green">
            <span>Equipments </span> <span class="text-black">Booking Made Simple with</span>
            <span class="mx-4 text-black ">'<span>Audio</span><span class="text-green">Visual'</span></span>
          </div>
          <transition name="fade">
            <h5 class=" mt-2 text-overline text-black">
              A streamlined platform by the Ministry of Information for reserving media and communication equipment.
            </h5>
          </transition>
          <div>
            <v-btn to="/equipments" append-icon="mdi-unfold-more-horizontal" color='green'
              class=" text-black text-body-4 text-uppercase mt-4 " large text="Explore our Equipments" />
          </div>
        </v-col>
      </v-row>
    </v-container>


    <v-row class="mx-4">
      <v-col cols=4>
        <v-card style="background: linear-gradient(to bottom right,green,white); padding: 1rem; border-radius: 12px;"
          hover class="text-center text-h4 d-flex flex-column justify-center font-weight-medium" height='100px'>
          RELIABLE
        </v-card>
      </v-col>
      <v-col cols=4>
        <v-card style="background: linear-gradient(to bottom right,white, green); padding: 1rem; border-radius: 12px;"
          hover class="text-center text-h4 d-flex flex-column justify-center font-weight-medium" height='100px'>
          HIGH QUALITY
        </v-card>
      </v-col>
      <v-col cols=4>
        <v-card style="background: linear-gradient(to bottom right,green, white); padding: 1rem; border-radius: 12px;"
          hover class="text-center text-h4 d-flex flex-column justify-center font-weight-medium" height='100px'>
          AFFORDABLE
        </v-card>
      </v-col>
    </v-row>
    <!-- Footer -->
    <v-app-bar dense location="bottom" class="text-center border" elevation="1">
      <v-container class="d-flex justify-center align-center">
        <div class="text-caption">&copy; Ministry of Information</div>
      </v-container>
    </v-app-bar>
  </v-app>
</template>

<script>
  export default {
    name: "LandingPage",
  };
</script>