<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar class="px-16 elevation-0 border">
      <div class="d-flex align-center">
        <v-btn class="text-caption text-xs" to="/equipments">
          <div class="text-overline mx-2">
            <span>Audio</span><span class="text-green">Visual</span>
          </div>
        </v-btn>
      </div>
      <v-spacer></v-spacer>
      <v-btn class="mx-2 text-caption bg-green" to="/login">Login</v-btn>
      <v-btn class="text-caption bg-blue-grey-lighten-5">About us</v-btn>
    </v-app-bar>

    <!-- Main Content -->
    <v-container fluid>
      <v-row align="center mt-4" justify="center">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <v-card class="pa-4 border mt-8 elevation-0 border" width="600" hover>
            <div class="text-h6 font-weight-bold mb-1 text-overline">Register</div>
            <div class="text-caption mb-4">
              This information helps us to create your profile and serve you better
            </div>

            <v-form @submit.prevent="register">
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.firstname" label="First name" density="comfortable"
                    class="mb-3 text-caption" hide-details />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.lastname" label="Last name" density="comfortable" class="mb-3"
                    hide-details />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.email" label="Email" density="comfortable" class="mb-3" hide-details />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.phone" label="Phone" density="comfortable" class="mb-3" hide-details />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="form.gender" :items="['Male', 'Female', 'Other']" label="Gender"
                    density="comfortable" class="mb-3" hide-details />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.district" label="District" density="comfortable" class="mb-3"
                    hide-details />
                </v-col>
                <v-col cols="12" md="12">
                  <v-text-field v-model="form.locationId" label="Location" density="comfortable" class="mb-3"
                    hide-details />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.password" type="password" label="Password" density="comfortable"
                    class="mb-4" hide-details />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="form.confirmPassword" type="password" label="Confirm password"
                    density="comfortable" class="mb-4" hide-details />
                </v-col>
              </v-row>

              <v-btn block color="primary" class="text-overline" type="submit">Register</v-btn>
            </v-form>

            <div class="text-caption mb-4 mt-2">
              Have an account?
              <v-btn class="text-green font-weight-bold text-capitalize" variant="text" size="xs"
                to="/login">Login</v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <v-app-bar dense location="bottom" class="text-center border" elevation="1">
      <v-container class="d-flex justify-center align-center">
        <div class="text-caption">&copy; Ministry of Information</div>
      </v-container>
    </v-app-bar>
    <v-snackbar-queue v-model="snackbars" :timeout="2000" />
  </v-app>
</template>
<script>
  import { registerUser } from "@/services/auth.service"; // adjust path if needed

  export default {
    data() {
      return {
        snackbars: [],
        form: {
          firstname: "",
          lastname: "",
          email: "",
          phone: "",
          gender: "",
          locationId: "",
          password: "",
          confirmPassword: "",
        },
      };
    },
    methods: {
      async showSnack(message, color) {
        this.snackbars.push({
          text: message,
          color: color,
        })
      },
      async register() {
        if (this.form.password !== this.form.confirmPassword) {
          alert("Passwords do not match.");
          return;
        }

        try {
          const response = await registerUser(this.form);
          await this.showSnack(`Registration successful!`, "success");
          this.$router.push("/customer");


        } catch (error) {
          if (error.response?.data?.detail) {
            this.showSnack(error.response.data.detail, "error");

          } else {
            alert("An unexpected error occurred during registration.");
          }
        }
      },
    },
  };
</script>