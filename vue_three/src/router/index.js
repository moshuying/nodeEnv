import Vue from "vue";
import Router from "vue-router";
const devIn = require("./dev." + process.env.NODE_ENV);
// const devIn = require("./dev.development");

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/Home",
      name: "Home",
      component: devIn("Home")
    },
    {
      path: "/About",
      name: "About",
      component: devIn("About")
    },
    {
      path: "/Three",
      name: "Three",
      component: devIn("Three")
    }
  ]
});
