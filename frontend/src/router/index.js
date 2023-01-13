import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomeView.vue";
import store from "../store/index"

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: "/about",
    name: "about",

    component: () =>
      import("../views/AboutView.vue"),
      meta: {
        requiresAuth: false,
      }
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register"),
    meta: {
      requiresAuth: false,
    }
  },
  {
    path: "/profile",
    name: "Profile",
    component: () => import("../views/Profile"),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../views/Dashboard"),
    meta: {
      requiresAuth: true,
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {

    if(store.getters.authenticated === false) {
      next({
        path: "/login",
        params: {nextURl: to.fullPath}
      })
    }

  } else {
    next();
  }
});

export default router;
