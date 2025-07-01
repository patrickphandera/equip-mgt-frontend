import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // CUSTOMER LAYOUT
  {
    path: '/accountant',
    component: () => import('@/layouts/AccountantLayout.vue'),
    children: [
      {
        path: '',
        redirect: 'accountant/dashboard',
      },

      {
        path: 'account',
        name: 'AccountantAccount',
        component: () => import('@/views/accountant/Account.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'dashboard',
        name: 'AccountantDashboard',
        component: () => import('@/views/accountant/Dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'payments',
        name: 'AccountantPayments',
        component: () => import('@/views/accountant/Payments.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'bookings',
        name: 'AccountantBookings',
        component: () => import('@/views/accountant/Bookings.vue'),
        meta: { requiresAuth: true },
      },
    ]
  },
  {
    path: '/customer',
    component: () => import('@/layouts/CustomerLayout.vue'),
    children: [
      {
        path: 'account',
        name: 'CustomerAccount',
        component: () => import('@/views/customer/Account.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '',
        redirect: 'customer/dashboard',
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/customer/Dashboard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'equipments',
        name: 'CustomerEquipments',
        component: () => import('@/views/customer/Equipments.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'equipments/:id',
        name: 'SpecificCustomerEquipment',
        component: () => import('@/views/customer/Equipment.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'bookings',
        name: 'CustomerBookings',
        component: () => import('@/views/customer/Bookings.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'payments',
        name: 'CustomerPayments',
        component: () => import('@/views/customer/Payments.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // BOOKING OFFICER LAYOUT
  {
    path: '/chief-technician',
    component: () => import('@/layouts/ChiefTechnicianLayout.vue'),
    children: [
      {
        path: '',
        name: 'BookingOfficerDashboard',
        component: () => import('@/views/booking_officer/Home.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '',
        redirect: 'dashboard',
      },
      {
        path: 'equipments',
        name: 'BookingOfficerEquipments',
        component: () => import('@/views/booking_officer/Equipments.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'technicians',
        name: 'BookingOfficerTechnicians',
        component: () => import('@/views/booking_officer/Technicians.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'equipments-categories',
        name: 'BookingOfficerEquipmentsCategories',
        component: () => import('@/views/booking_officer/EquipmentCategories.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'equipments-sets',
        name: 'BookingOfficerEquipmentsSets',
        component: () => import('@/views/booking_officer/EquipmentSets.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'equipments-set-items',
        name: 'BookingOfficerEquipmentsSetItems',
        component: () => import('@/views/booking_officer/EquipmentSetItems.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'equipments-availabilities',
        name: 'BookingOfficerEquipmentsAvailabilities',
        component: () => import('@/views/booking_officer/EquipmentAvailability.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'equipments-conditions',
        name: 'BookingOfficerEquipmentsConditions',
        component: () => import('@/views/booking_officer/EquipmentConditions.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'bookings',
        name: 'BookingOfficerBookings',
        component: () => import('@/views/booking_officer/Bookings.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'locations',
        name: 'BookingOfficerLocations',
        component: () => import('@/views/booking_officer/Locations.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'payments',
        name: 'BookingOfficerPayments',
        component: () => import('@/views/booking_officer/Payments.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'users',
        name: 'BookingOfficerUsers',
        component: () => import('@/views/booking_officer/Users.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },

  // 404 Catch-All
  {
    path: '/:catchAll(.*)',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
  },
  {
    path: '/equipments',
    name: 'Equipments',
    component: () => import('@/views/Equipments.vue'),
  },
  {
    path: '/login',
    name: 'LoginUser',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/login',
    name: 'LoginUser',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: () => import('@/views/Register.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global navigation guard
// router.beforeEach((to, from, next) => {
//   const isAuthenticated = !!localStorage.getItem('auth_token')
//   if (to.meta.requiresAuth && !isAuthenticated) {
//     return next({ path: '/login' }) 
//   }
//   next()
// })

export default router
