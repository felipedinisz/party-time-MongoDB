import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import store from "../store/index";

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/about",
    name: "about",

    component: () => import("../views/AboutView.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard.vue"),
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/newparty",
    name: "NewParty",
    component: () => import("../views/NewParty.vue"),
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (store.getters.authenticated === false) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
