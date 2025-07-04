<template>
  <v-container class="my-4 pb-4 ">
    <v-app-bar app color=" elevation-1  pr-4 " hover>
      <v-toolbar-title class="d-flex">
        <div class="d-flex">

          <div class="mx-1 text-overline ">Online equipments booking system</div>
        </div>

      </v-toolbar-title>
      <div class="d-flex">
        <!-- <v-btn class="mr-2" icon="mdi-menu"></v-btn> -->

        <div class="d-flex flex-column justify-center">
          <v-menu class="d-flex flex-column justify-center text-overline text-overline elevation-1">

            <template v-slot:activator="{ props: activatorProps, isActive }">
              <v-btn v-bind="activatorProps" class="d-flex flex-column justify-center text-overline text-overline"
                append-icon="mdi-unfold-more-horizontal">
                Gift Kawonga <v-icon>mdi-shield-lock</v-icon>
                <template v-slot:append>
                  <v-icon-btn :rotate="isActive ? 180 : 0" icon="$dropdown" size="16" variant="plain"
                    hide-overlay></v-icon-btn>
                </template>
              </v-btn>
            </template>

            <v-list>
              <v-list-item class="border-b " block to='/customer/account'>
                <div class=" "><v-btn color="" class="text-overline elevation-1 border">User
                    details</v-btn></div>
              </v-list-item>
              <v-list-item>
                <v-btn color="red" block class="text-overline" to='/login'>Logout</v-btn>
              </v-list-item>

            </v-list>
          </v-menu>
        </div>
        <v-btn class="mr-2" icon=""> <v-icon size="22px">mdi-bell-outline</v-icon></v-btn>
      </div>
    </v-app-bar>
  </v-container>
</template>
<style scoped>
  .border-left-green {
    border-left: 4px solid #4CAF50;
    /* Material green */
  }
</style>