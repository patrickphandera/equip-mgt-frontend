<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar class="  px-16 border " elevation="0">
      <v-btn class="text-caption text-xs" to="/equipments">
        <div class="d-flex align-center">
          <div class="text-overline mx-2">
            <span>Audio</span><span class="text-green">Visual</span>
          </div>


        </div>
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="mx-2 text-caption bg-green" to="/register">Register</v-btn>
      <v-btn class="text-caption bg-blue-grey-lighten-5">About us</v-btn>
    </v-app-bar>
    <v-app-bar dense location="bottom" class="text-center border" elevation="1">
      <v-container class="d-flex justify-center align-center">
        <div class="text-caption">
          &copy; Ministry of Information
        </div>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <div>
      <v-container fluid style="height: calc(100vh - 64px);">
        <v-row class="fill-height" align="center mt-4" justify="center">
          <!-- Left Column (Login Card) -->
          <v-col cols="12" md="6" class="d-flex justify-center">
            <v-card class="pa-6 border elevation-0" width="400" hover height="400">
              <div class="text-h6 font-weight-black mb-1 text-overline">Login</div>
              <div class="text-caption mb-6">
                Login for us to provide you a better service
              </div>

              <v-text-field label="Email or Phone" density="comfortable" class="mb-3" hide-details></v-text-field>

              <v-text-field label="Password" type="password" density="comfortable" class="mb-4"
                hide-details></v-text-field>

              <div class="text-caption mb-6">
                Don't have an account?
                <v-btn class="text-green font-weight-bold cursor-pointer text-capitalize" variant="text" size="xs"
                  to="/register">Register</v-btn>
              </div>

              <v-btn block color="primary" class="text-overline">Login</v-btn>
            </v-card>
          </v-col>

          <!-- Right Column (Text/Graphics Placeholder) -->
          <!-- <v-col cols="12" md="6" class="d-flex align-center justify-center">
          <v-card height="400" width="400" hover class="text-h5 font-weight-light mt-6">
            <v-img src='/8460368.jpg'></v-img>
          </v-card>
        </v-col> -->
        </v-row>
      </v-container>

    </div>




  </v-app>
</template>

<script>
  export default {}
</script>